package Day4.EmployeeManagementSystem;

public class MainApp {
    static void main() {
        EmployeeDAO dao=new EmployeeDAO();
        dao.getallEmployees();
        dao.addEmployer(new Employee(9,"Nareshgoud",76000));
        System.out.println("success");
    }
}
