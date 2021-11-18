# TamTam Storybook

Current version: 0.1.8

## Setup

- 1 Add to package.json:

```json
  "tamtam-components": "https://github.com/Bruno-de-l-Escaille/storybook.git#v0.1.0"
```

Note: you can change the version

- 2 Include the css file to the global style

```js
  @import "tamtam-components/build/css/main.css";
```

- 3 Start using components

Ex: Header component :

```js
import { Header } from "tamtam-components";

<Header
  auth={{ navCommunity: null, user: null }}
  lng={lng}
  onLanguageChange={(lang) => changeLng(lang)}
  app={App}
/>;
```

## Pour accèder au différents composants:

https://bruno-de-l-escaille.github.io/storybook

Puis vous cliquez sur l'onglet story en bas pour voir le code du composant

![](https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/wiki/storybook.png)
