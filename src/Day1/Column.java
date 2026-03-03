package Day1;

import Day3.ConnectionFactory;

import java.sql.*;

public class Column {

    public static void main(String[] args) {
        String query = "SELECT * FROM employee";
        try (Connection c = ConnectionFactory.getConnection();
             Statement s = c.createStatement();
             ResultSet res = s.executeQuery(query)) {

            ResultSetMetaData meta = res.getMetaData();
            System.out.println("Column count:        " + meta.getColumnCount());
            System.out.println("Column type (col 1): " + meta.getColumnType(1));
            System.out.println("Column type name:    " + meta.getColumnTypeName(1));
            System.out.println("Catalog name:        " + meta.getCatalogName(1));
            System.out.println("Display size (col 1):" + meta.getColumnDisplaySize(1));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve column metadata", e);
        }
    }
}
