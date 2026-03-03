package Day2;

import Day3.ConnectionFactory;

import java.sql.*;
import java.util.Scanner;

public class Connect {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter employee ID: ");
        int id = sc.nextInt();
        sc.close();

        String query = "SELECT id, name, salary FROM employee WHERE id = ?";
        try (Connection c = ConnectionFactory.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, id);
            try (ResultSet result = ps.executeQuery()) {
                if (result.next()) {
                    int realId = result.getInt("id");
                    String name = result.getString("name");
                    int salary = result.getInt("salary");
                    System.out.println("ID: " + realId + ", Name: " + name + ", Salary: " + salary);
                } else {
                    System.out.println("No employee found with ID: " + id);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch employee", e);
        }
    }
}
