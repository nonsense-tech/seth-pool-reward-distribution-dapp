import React, { Component } from 'react';
import papaparse from 'papaparse';

class CsvLoader extends Component {
  onFileChange = event => {
    const fileReader = new FileReader();
    fileReader.onloadend = e => {
      const data = papaparse.parse(
        e.target.result,
        { delimiter: ',', header: false, skipEmptyLines: true }
      ).data;
      this.props.onDataLoaded(data);
    }
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0]);
    }
  }
  render() {
    return <input type="file" name="file" accept=".csv" onChange={this.onFileChange}/>;
  }
}

export default CsvLoader;
