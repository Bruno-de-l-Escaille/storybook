import React, { useEffect, useState } from "react";
import styles from "./Tickets.module.scss";
import { ModelSelect } from "./ModelSelect";
import { fetchGuests, printLabels } from "../../../../api/event";
import { getApiUrl, isEmpty } from "../../../../utils";
import { PrintedTicket } from "./PrintedTicket";
import { PrintedTicketSkeleton } from "./PrintedTicketSkeleton";
import { TicketsLeftSkeleton } from "./TicketsLeftSkeleton";
import { useMemo } from "react";
import { I18N } from "../../../../i18n";
import { ClipLoader } from "react-spinners";

function extractGeneratedTime(labelFile) {
  const match = labelFile.match(
    /_(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})_(\d{2})\.pdf$/
  );
  if (match) {
    const [, year, month, day, hour, minute] = match;
    return `${day}/${month}/${year.slice(2)} ${hour}:${minute}`;
  }
  return "";
}

export const Tickets = (props) => {
  const { labelTemplates, language, env, auth, eventId, clientId } = props;
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [printCount, setPrintCount] = useState(0);
  const [selectedModel, setSelectedModel] = useState(null);
  const [reload, setReload] = useState(0);
  const apiUrl = getApiUrl(env);

  const labelFilesData = useMemo(() => {
    if (!guests || !Array.isArray(guests) || guests.length === 0) return [];
    const models = labelTemplates
      ? labelTemplates.reduce((acc, template) => {
          const brand = template.brand;
          const match =
            template.shortDescription &&
            template.shortDescription.match(/(.+?)\s*\((\d+)\)/);
          acc.push({
            labelFile: template.labelFile,
            brand,
            reference: template.reference,
            dimension: match && match[1] ? match[1].trim() : "",
            modelName: `${brand} ${template.reference}`,
          });
          return acc;
        }, [])
      : [];

    const labelFileMap = {};
    guests.forEach((guest) => {
      if (!guest.labelFile) return;
      if (!labelFileMap[guest.labelFile]) {
        labelFileMap[guest.labelFile] = {
          labelFile: guest.labelFile,
          guestsCount: 0,
        };
      }
      labelFileMap[guest.labelFile].guestsCount += 1;
    });

    return Object.values(labelFileMap).map((entry) => {
      const model = models.find(
        (m) =>
          m.labelFile === entry.labelFile ||
          (entry.labelFile.includes(m.brand) &&
            entry.labelFile.includes(m.reference))
      );
      return {
        ...entry,
        dimension: model ? model.dimension : "",
        modelName: model ? model.modelName : entry.labelFile,
        generatedTime: extractGeneratedTime(entry.labelFile),
        eventId: eventId,
        clientId: clientId,
      };
    });
  }, [guests, labelTemplates]);

  useEffect(() => {
    setLoading(true);
    const filters = [
      {
        property: "event.id",
        operator: "eq",
        value: eventId,
      },
    ];
    fetchGuests({
      filters,
      apiUrl,
      token: auth.token,
    }).then((data) => {
      const guests = data.data || [];
      setGuests(guests);
      if (guests.length > 0) {
        const initialPrintCount = guests.reduce((acc, guest) => {
          return (
            acc +
            ((!Boolean(guest.printed) && !isEmpty(guest.registeredChoice)) || 0)
          );
        }, 0);
        setPrintCount(initialPrintCount);
      } else {
        setPrintCount(0);
      }
      setLoading(false);
    });
  }, [reload]);

  const handleGenerateTickets = () => {
    setIsProcessing(true);
    printLabels({
      apiUrl,
      token: auth.token,
      eventId,
      brand: selectedModel.brand,
      reference: selectedModel.reference,
    })
      .then((response) => {
        setReload((r) => r + 1);
        setIsProcessing(false);
      })
      .catch((error) => {
        console.error("Error generating labels:", error);
        setIsProcessing(false);
      });
  };

  return (
    <div className={styles.tickets}>
      <div className={styles.tickets_content}>
        <div className={styles.tickets_section_left}>
          {loading ? (
            <TicketsLeftSkeleton />
          ) : (
            <div className={styles.tickets_generateTickets}>
              <span className={styles.tickets_generateTickets_title}>
                {I18N[language]["generatePdfTickets"]}
              </span>
              <div className={styles.tickets_generateTickets_printCountWrapper}>
                <span className={styles.tickets_generateTickets_printCount}>
                  {printCount}
                </span>
                <span className={styles.tickets_generateTickets_printLabel}>
                  {I18N[language]["toPrint"]}
                </span>
              </div>
              <span className={styles.tickets_generateTickets_modelDescription}>
                {I18N[language]["chooseTicketModel"]}
              </span>
              <div className={styles.tickets_generateTickets_modelSelect}>
                <ModelSelect
                  labelTemplates={labelTemplates}
                  language={language}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  printCount={printCount}
                />
                {selectedModel && (
                  <div className={styles.selectedModelInfo}>
                    <span className={styles.selectedModelInfo_label}>
                      {I18N[language]["ticketsDimension"]} :
                    </span>
                    <span className={styles.selectedModelInfo_dimension}>
                      {selectedModel.dimension}
                    </span>
                    <span className={styles.selectedModelInfo_numberPerPage}>
                      {selectedModel.numberPerPage}{" "}
                      {I18N[language]["ticketsPerPage"]}
                    </span>
                    <span className={styles.selectedModelInfo_pagesCountInfo}>
                      {I18N[language]["ticketsNumberToPage"]
                        .replace(
                          "{{pageCount}}",
                          Math.ceil(printCount / selectedModel.numberPerPage)
                        )
                        .replace("{{toPrint}}", printCount)}
                    </span>
                  </div>
                )}
              </div>
              {printCount > 0 ? (
                <button
                  className={styles.tickets_generateTickets_actionButton}
                  onClick={handleGenerateTickets}
                  disabled={!selectedModel || isProcessing}
                >
                  {isProcessing && <ClipLoader size={16} color="#ffffff" />}
                  {I18N[language]["generateTickets"]}
                </button>
              ) : (
                <div className={styles.tickets_generateTickets_noLabelsToPrint}>
                  {I18N[language]["noTicketsToPrint"]}
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.tickets_section_right}>
          {loading ? (
            <PrintedTicketSkeleton />
          ) : (
            labelFilesData.length > 0 && (
              <PrintedTicket
                labels={labelFilesData}
                env={env}
                language={language}
                auth={auth}
                setReload={setReload}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
