package Day2;

import java.sql.*;
import java.util.Scanner;


public class Connect {
    static void main() {
       try{
           Class.forName("com.mysql.cj.jdbc.Driver");
           Connection c= DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc","root","Naresh@034");
//           String q="Insert into employee values(?,?,?)";
//           PreparedStatement ps=c.prepareStatement(q);
           Scanner sc=new Scanner(System.in);
           int id=sc.nextInt();
//           String name=sc.next();
//           int salary=sc.nextInt();
//           ps.setInt(1,id);
//           ps.setString(2,name);
//           ps.setInt(3,salary);
//           ps.execute();
//           ps.close();
//           c.close();
//           sc.close();


           //select query

           String qu="select id,name,salary from employee where id=?";

           PreparedStatement p=c.prepareStatement(qu);
           p.setInt(1,id);
           ResultSet result=p.executeQuery();
           if(result.next()){
               int realId=result.getInt("id");
               String name=result.getString("name");
               result.getInt("salary");
               System.out.println(realId+" "+name);
           }

       }
       catch (Exception e){
           System.out.println(e);
       }
    }
}
