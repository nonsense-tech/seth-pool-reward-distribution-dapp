import React, { Component } from 'react';
import papaparse from 'papaparse';
import { Upload, message, Button, Icon } from 'antd';

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
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
  onChange = info => {
    if (info.file.status === 'done') {
      const fileReader = new FileReader();
      fileReader.onloadend = e => {
        const data = papaparse.parse(
          e.target.result,
          { delimiter: ',', header: false, skipEmptyLines: true }
        ).data;
        this.props.onDataLoaded(data);
      }
      if (info.file.originFileObj) {
        fileReader.readAsText(info.file.originFileObj);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  render() {
    return (
      <Upload
        accept=".csv"
        onChange={this.onChange}
        customRequest={dummyRequest}
        showUploadList={false}
        disabled={this.props.disabled}
      >
        <Button>
          <Icon type="upload" /> Upload CSV
        </Button>
      </Upload>
    );
  }
}

export default CsvLoader;
