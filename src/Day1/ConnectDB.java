package Day1;

import java.sql.*;
import java.util.ArrayList;

public class ConnectDB {

    static void main() {
        //Load class
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            //connection
            String url="jdbc:mysql://localhost:3306/jdbc";
            String name="root";
            String pass="";
            Connection c=DriverManager.getConnection(url,name,pass);
            //statement from sql
            Statement s=c.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,0);
            String q="Select * from employee";
            ResultSet res=s.executeQuery(q);
            ArrayList<Employee> e=new ArrayList<>();

            while(res.next()==true){
                Employee a=new Employee();
                a.setId(res.getInt(1));
                a.setName(res.getString(2));
                a.setSalary(res.getInt(3));
                e.add(a);
            }
            for(Employee x:e){
                System.out.println(x.getId());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }


    }
}
