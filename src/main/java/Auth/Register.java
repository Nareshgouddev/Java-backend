package Auth;

import javax.sql.*;

import DataBase.copy.DBConnection;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Register extends HttpServlet{
	protected void doPost(HttpServletRequest req,HttpServletResponse res)throws IOException,ServletException {
		String user=req.getParameter("user");
		String email=req.getParameter("email");
		String pass=req.getParameter("password");
		int row=0;
		try(Connection c=DBConnection.getConnection()){
			String query="INSERT INTO Users(User,email,password) values(?,?,?)";
			
			PreparedStatement p=c.prepareStatement(query);
			
			p.setString(1, user);
			p.setString(2, email);
			p.setString(3, pass);
			
			row=p.executeUpdate();
			if(row>0) {
				res.sendRedirect("Index.html");
			}
			else {
				res.sendError(404);
			}
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
		
	}
	
	
}
