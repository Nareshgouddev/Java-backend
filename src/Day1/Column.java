package Day1;

import java.sql.*;

public class Column {
    static void main() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            //connection
            String url="jdbc:mysql://localhost:3306/jdbc";
            String name="root";
            String pass="Naresh@034";
            Connection c= DriverManager.getConnection(url,name,pass);
            //statement from sql
            Statement s=c.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,0);
            String q="Select * from employee";
            ResultSet res=s.executeQuery(q);

            ResultSetMetaData res1 =res.getMetaData();

            System.out.println(res1.getColumnCount());
            System.out.println(res1.getColumnType(1));
            System.out.println(res1.getColumnTypeName(1));
            System.out.println(res1.getCatalogName(1));
            System.out.println(res1.getColumnDisplaySize(1));

        }
        catch (Exception e){
            System.out.println(e);
        }
    }
}
