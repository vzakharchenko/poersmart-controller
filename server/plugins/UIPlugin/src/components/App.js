import React from 'react';
import { inject, observer } from 'mobx-react';
import { Panel } from 'react-bootstrap';
import Loading from './Loading';
import PoersSmartTabs from './Tabs';

// const staticServerUrl = process.env.STATIC_SERVER_URL;

export default @inject('poerSmartGateWayStore', 'languageStore')

 @observer
class App extends React.Component {
  static handleLanguageChange(event, setLanguage) {
    const lanuage = event.target.value;

    setLanguage(lanuage);
  }

  componentDidMount() {
    const { getLangs, getLang } = this.props.languageStore;
    getLangs();
    getLang();
    if (!this.props.poerSmartGateWayStore.isGateWaysLoading) {
      this.props.poerSmartGateWayStore.load();
    }
  }

  render() {
    const { isGateWaysLoading } = this.props.poerSmartGateWayStore;
    const { language, languages, setLanguage } = this.props.languageStore;
    return (
      <Panel>
        <Panel.Heading>
          <select
            id="language"
            name="language"
            onChange={(event) => { App.handleLanguageChange(event, setLanguage); }}
            style={{ width: '100px' }}
          >
            {languages.map(lang => (
              language === lang
                ? <option id={lang} value={lang} selected>{lang}</option>
                : <option id={lang} value={lang}>{lang}</option>))}
          </select>
        </Panel.Heading>
        <Panel.Body>
          {isGateWaysLoading ? <Loading /> : <PoersSmartTabs /> }

        </Panel.Body>
      </Panel>
    );
  }
}
