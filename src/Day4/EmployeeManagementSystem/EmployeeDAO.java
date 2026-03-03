package Day4.EmployeeManagementSystem;
import Day3.ConnectionFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO {
    public List<Employee> getallEmployees() {
        List<Employee> list = new ArrayList<>();
        String q = "{call getAll()}";
        try (Connection c = ConnectionFactory.getConnection();
             CallableStatement cb = c.prepareCall(q);
             ResultSet res = cb.executeQuery()) {

            while (res.next()) {
                list.add(new Employee(res.getInt("id"), res.getString("name"), res.getInt("salary")));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch employees", e);
        } catch (Exception e) {
            throw new RuntimeException("Database connection error", e);
        }
        return list;
    }

    public void addEmployer(Employee emp) {
        String query = "INSERT INTO EMPLOYEE VALUES(?, ?, ?)";
        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {

            ps.setInt(1, emp.getId());
            ps.setString(2, emp.getName());
            ps.setInt(3, emp.getSalary());
            ps.execute();
        } catch (Exception e) {
            throw new RuntimeException("Failed to add employee: " + emp, e);
        }
    }
}
