import React from "react";
import TableLoader from "./TableLoader";

const Table = (props) => {
  const renderHeader = () => {
    return (
      <tr>
        <th className="table-header">SN</th>
        {props.headers.map(({ title }) => {
          return (
            <>
              <th className="table-header" key={title}>{title}</th>
            </>
          );
        })}
        {props.action ? <th className="table-header">Actions</th> : null}
      </tr>
    );
  };

  const renderBody = () => {
    return props.data?.map((data, index) => (
      <tr key={data._id}>
        <td className="table-data ps-3">
          {index + 1}
        </td>
        {props.headers?.map((header, keys) => {
          if (header?.render) {
            return <td className="table-data" key={keys}>{header.render(data)}</td>;
          } else {
            return <td className="table-data" key={keys}>{data[header.field]}</td>;
          }
        })}
        <td className="table-data">
          {props.action?.map((element, actionIndex) => (
            <span 
              key={actionIndex}
              className="table-data" 
              style={{color: element.color}}
              onClick={(e) => {
                element?.action(e, data._id);
              }}
            >
              {element.icon}
            </span>
          ))}
        </td>
      </tr>
    ));
  };

  return (
    <>
      {props.loader ? (
        <TableLoader
          headers={props.headers}
          // data={props.headers}
          action={props.action}
          numberOfRows={3}
        />
      ) : (
        <div className="tableDiv">
          <table className="table table-borderless tables" cellPadding='10' >
            <thead>{renderHeader()}</thead>

            {renderBody()}
          </table>
        </div>
      )}
    </>
  );
};

export default Table;
