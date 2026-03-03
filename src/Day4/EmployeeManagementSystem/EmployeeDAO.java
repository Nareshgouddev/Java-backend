package Day4.EmployeeManagementSystem;
import Day3.ConnetionFactory;

import java.sql.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO {
    public List<Employee> getallEmployees() {
        List<Employee> list =new ArrayList<>();
        String q="{call getAll()}";
        try(Connection c=ConnetionFactory.getConnection();
            CallableStatement cb=c.prepareCall(q);
             ResultSet res=cb.executeQuery();
        ){
          while(res.next()!=false){
              list.add(new Employee(res.getInt(1),res.getString(2),res.getInt(3)));
          }
            for (int i = 0; i < list.size(); i++) {
                System.out.println(list.get(i));
            }
        }catch(SQLException e){
            System.out.println(e);
        }
        return list;
    }
//what if we want directly to add the employer in the list

    public void addEmployer(Employee emp){
        String query="INSERT INTO EMPLOYEE VALUES(?,?,?)";
        try(Connection con=ConnetionFactory.getConnection();
            PreparedStatement ps=con.prepareStatement(query);
        ){
            ps.setInt(1,emp.getId());
            ps.setString(2,emp.getName());
            ps.setInt(3,emp.getSalary());
            ps.execute();
        }
        catch (Exception e){
            System.out.println(e);
        }
    }
}
