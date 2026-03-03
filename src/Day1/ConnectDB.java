package Day1;

import Day3.ConnectionFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ConnectDB {

    public static void main(String[] args) {
        String query = "SELECT id, name, salary FROM employee";
        try (Connection c = ConnectionFactory.getConnection();
             Statement s = c.createStatement();
             ResultSet res = s.executeQuery(query)) {

            List<Employee> employees = new ArrayList<>();
            while (res.next()) {
                Employee e = new Employee();
                e.setId(res.getInt("id"));
                e.setName(res.getString("name"));
                e.setSalary(res.getInt("salary"));
                employees.add(e);
            }
            for (Employee e : employees) {
                System.out.println(e);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch employees", e);
        }
    }
}
