# TamTam Storybook

Current version: 0.1.0

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
    auth={{ navCommunity: null, user: null, }}
    lng={lng}
    onLanguageChange={(lang) => changeLng(lang)}
    app={App} />
```
