import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontFamily: "Roboto",
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderBottom: 1,
    fontWeight: 700,
    width: "100%",
  },
  cell: {
    //width: "17%",
  },
});

const Table = (props) => {
  const { children, ...other } = props;

  Table.propTypes = {
    children: PropTypes.node,
  };

  return <View style={styles.tableContainer}>{children}</View>;
};

const TableRow = (props) => {
  const { children, ...other } = props;

  TableRow.propTypes = {
    children: PropTypes.node,
  };

  return <View style={styles.row}>{children}</View>;
};

const TableHeader = (props) => {
  const { children, ...other } = props;

  TableHeader.propTypes = {
    children: PropTypes.node,
  };

  return <View style={styles.header}>{children}</View>;
};

const TableCell = (props) => {
  const { children, align, width, ...other } = props;

  TableCell.propTypes = {
    children: PropTypes.node || PropTypes.string,
  };

  return (
    <Text style={[styles.cell, { textAlign: align, width: width }]}>
      {children}
    </Text>
  );
};

export { Table, TableRow, TableCell, TableHeader };
