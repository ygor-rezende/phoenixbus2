const React = require("react");
const PropTypes = require("prop-types");
const {
  View,
  StyleSheet,
  Text
} = require("@react-pdf/renderer");
const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontFamily: "Roboto",
    fontSize: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderBottom: 1,
    fontWeight: 700,
    width: "100%"
  },
  cell: {
    paddingRight: 2
  }
});
const Table = props => {
  const {
    children,
    ...other
  } = props;
  Table.propTypes = {
    children: PropTypes.node
  };
  return /*#__PURE__*/React.createElement(View, {
    style: styles.tableContainer
  }, children);
};
const TableRow = props => {
  const {
    children,
    bgColor,
    ...other
  } = props;
  TableRow.propTypes = {
    children: PropTypes.node
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.row, {
      backgroundColor: bgColor
    }]
  }, children);
};
const TableHeader = props => {
  const {
    children,
    ...other
  } = props;
  TableHeader.propTypes = {
    children: PropTypes.node
  };
  return /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, children);
};
const TableCell = props => {
  const {
    children,
    align,
    width,
    fontSize,
    ...other
  } = props;
  TableCell.propTypes = {
    children: PropTypes.node || PropTypes.string
  };
  return /*#__PURE__*/React.createElement(Text, {
    style: [styles.cell, {
      textAlign: align,
      width: width,
      fontSize: fontSize
    }]
  }, children);
};
module.exports = {
  Table,
  TableRow,
  TableCell,
  TableHeader
};