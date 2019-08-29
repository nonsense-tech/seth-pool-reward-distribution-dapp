import React, { Component } from 'react';
import { Table } from 'antd';

class DataTable extends Component {
  render() {
    return (
      <Table
        size="small"
        pagination={false}
        dataSource={this.props.data.map((item, index) => ({
          key: index,
          address: item[0],
          value: item[1],
        }))}
        columns={[
          {
            title: 'Address',
            dataIndex: 'address',
          },
          {
            title: 'Reward, SNX',
            dataIndex: 'value',
          }
        ]}
      />
    );
  }
}

export default DataTable;
