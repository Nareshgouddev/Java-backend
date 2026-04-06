package DataBase.copy;

import java.sql.*;
import javax.sql.*;

public class DBConnection {
	public static final String url="jdbc:mysql://localhost:3306/BlogSite.Users";
	public static  final String name="root";
	public static final String pass="Naresh@034";
	public static Connection getConnection() throws SQLException {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException  e) {
			e.printStackTrace();
		}
	    return DriverManager.getConnection(url,name,pass);
	}
}
