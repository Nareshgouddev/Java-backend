package Day4;
import Day3.ConnetionFactory;

import java.sql.*;



public class Employee {
    static void main() {

       try{
           Connection c=ConnetionFactory.getConnection();
           String query="{call getMethod()}";
           CallableStatement cb=c.prepareCall(query);
           ResultSet res=cb.executeQuery();
           while(res.next()!=false){
               System.out.println(res.getInt(1));
               System.out.println(res.getString(2));
           }
       }
       catch (Exception e){
           System.out.println(e);
       }
    }
}
