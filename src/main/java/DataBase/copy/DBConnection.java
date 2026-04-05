package DataBase.copy;

import java.sql.*;
import javax.sql.*;



public class DBConnection {
        static Connection c=null;
	public static Connection getConnection() {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			String url="jdbc:mysql://localhost:3306/BlogSite";
			String name="root";
			String pass="Naresh@034";
			c=DriverManager.getConnection(url,name,pass);
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		return c;
	}
}
