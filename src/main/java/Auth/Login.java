package Auth;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Login extends HttpServlet{
	protected void doPost(HttpServletRequest req,HttpServletResponse resp)throws ServletException,IOException{
		String user=req.getParameter("email");
		String pass=req.getParameter("password");
	
		resp.setContentType("text/html");
		PrintWriter	p=resp.getWriter();
		int rows=0;
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			String url="jdbc:mysql://localhost:3306/BlogSite";
			String name="root";
			String pass1="Naresh@034";
			Connection c=DriverManager.getConnection(url,name,pass1);
			
			
			String query="INSERT INTO Login(Name,Password) values(?,?)";
			
			PreparedStatement ps=c.prepareStatement(query);
			
		    ps.setString(1, user);
		    ps.setString(2, pass);
		    ps.executeUpdate();
			
		    if(rows > 0) {
		        p.print("<h1>Data saved successfully!</h1>");
		    } else {
		        p.print("<h1>Failed to save data.</h1>");
		    }
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
		
		
		
	}
}

