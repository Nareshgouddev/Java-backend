package Day4;
import Day3.ConnectionFactory;

import java.sql.*;

public class Employee {
    public static void main(String[] args) {
        String query = "{call getMethod()}";
        try (Connection c = ConnectionFactory.getConnection();
             CallableStatement cb = c.prepareCall(query);
             ResultSet res = cb.executeQuery()) {

            while (res.next()) {
                System.out.println("ID: " + res.getInt(1) + ", Name: " + res.getString(2));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute stored procedure", e);
        }
    }
}
