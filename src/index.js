import React from "react";
import ReactDOM from "react-dom";
import { getAccounts, getCleanings, getChildren, getAllIds } from "./data.js";

class Table extends React.Component {
  constructor() {
    super();

    this.state = {
      accounts: getAccounts(),
      cleanings: getCleanings(),
      collapsedRows: [],
    };
  }

  handleRowClick(rowId) {
    const currentCollapsedRows = this.state.collapsedRows;
    const isParentCurrentlyCollapsed = currentCollapsedRows.includes(rowId);
    let newCollapsedRows = currentCollapsedRows;
    const accounts = getAllIds(this.state.accounts, rowId, [rowId]);

    accounts.forEach(id => {
      if (isParentCurrentlyCollapsed) {
        if (newCollapsedRows.includes(id)) {
          newCollapsedRows = newCollapsedRows.filter(i => i !== id);
        }
      } else {
        if (!newCollapsedRows.includes(id)) {
          newCollapsedRows = newCollapsedRows.concat(id);
        }
      }
    });

    this.setState({ collapsedRows: newCollapsedRows });
  }

  renderItem(item) {
    const clickCallback = () => this.handleRowClick(item.id);

    var totalArea = 0;
    var totalTime = 0;
    const accounts = getAllIds(this.state.accounts, item.id, [item.id]);

    accounts.forEach(a => {
      this.state.cleanings.forEach(cleaning => {
        if (cleaning.account === a) {
          totalArea += cleaning.area;
          totalTime += cleaning.time;
        }
      });
    });

    if (!this.state.collapsedRows.includes(item.id)) {
      const itemRows = [
        <tr onClick={clickCallback} key={"row-data-" + item.id}>
          <td>{"-"}</td>
          <td>{item.name}</td>
          <td />
          <td>{"Total Area Cleaned: " + totalArea + " m^2"}</td>
          <td />
          <td>
            {"Total Time Spent Cleaning: " +
              Math.round((totalTime / (60 * 60)) * 100) / 100 +
              "hr"}
          </td>
          <td />
          <td>
            {"Cleaning Speed: " +
              Math.round((totalArea / (totalTime / (60 * 60))) * 100) / 100 +
              " m^2/hr"}
          </td>
        </tr>,
      ];
      return itemRows;
    }

    const itemRows = [
      <tr onClick={clickCallback} key={"row-data-" + item.id}>
        <td>{"+"}</td>
        <td>{item.name}</td>
      </tr>,
    ];
    return itemRows;
  }

  createRows(rows = [], currentAccountId = null) {
    const children = getChildren(this.state.accounts, currentAccountId);
    children.forEach(child => {
      const row = this.renderItem(child);
      rows.push(row);
      rows = this.createRows(rows, child.id);
    });
    return rows;
  }

  render() {
    var rows = this.createRows();
    return <table>{rows}</table>;
  }
}

ReactDOM.render(<Table />, document.getElementById("root"));
