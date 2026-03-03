package Day3;
import java.sql.*;


public class ConnetionFactory {
    public static Connection getConnection(){
        Connection con=null;
        try{
            Class.forName("com.mysql.cj.jdbc.Driver");
            con=DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc","root","Naresh@034");
            System.out.println("Connection Established");
        }
        catch (Exception e){
            System.out.println(e);
        }
        return con;
    }
}
