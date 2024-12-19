import React from "react";

const TableLoader = ({ headers, action, numberOfRows }) => {
  const renderHeader = () => {
    return (
      <tr>
        <th>SN</th>
        {headers.map(({ title }) => {
          return (
            <>
              <th key={title}>{title}</th>
            </>
          );
        })}
        {action ? <th>Actions</th> : null}
      </tr>
    );
  };

  return (
    <div className="tableDiv">
      <table className="table">
        <thead>{renderHeader()}</thead>

        {[...Array(numberOfRows)].map((element, index) => (
          <tr className="placeholder-glows tableRow" key={index}>
            <td>
              <div className="placeholder data"></div>
            </td>
            {headers.map((element) => {
              return (
                <>
                  <td>
                    <div className="placeholder data"></div>
                  </td>
                </>
              );
            })}
            <td>
              <div className="placeholder data"></div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default TableLoader;
