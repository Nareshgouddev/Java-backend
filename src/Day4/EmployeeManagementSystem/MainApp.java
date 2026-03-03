package Day4.EmployeeManagementSystem;

import java.util.List;

public class MainApp {
    public static void main(String[] args) {
        EmployeeDAO dao = new EmployeeDAO();

        List<Employee> employees = dao.getallEmployees();
        employees.forEach(System.out::println);

        dao.addEmployer(new Employee(9, "Nareshgoud", 76000));
        System.out.println("Employee added successfully.");
    }
}
