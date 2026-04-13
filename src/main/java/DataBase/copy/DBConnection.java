package DataBase.copy;

import java.sql.*;
import javax.sql.*;

public class DBConnection {
	public static final String url="jdbc:mariadb://localhost:3306/BlogSite";
	public static  final String name="root";
	public static final String pass="Naresh";
	public static Connection getConnection() throws SQLException {
		try {
			Class.forName("org.mariadb.jdbc.Driver");
		} catch (ClassNotFoundException  e) {
			e.printStackTrace();
		}
	    return DriverManager.getConnection(url,name,pass);
	}
}
