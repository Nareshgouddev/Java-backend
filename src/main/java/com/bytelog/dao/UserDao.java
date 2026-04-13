package com.bytelog.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import DataBase.copy.DBConnection;

public class UserDao {
	    
		public boolean registerUser(String alias, String email, String password, String role) {
			 
			String Registerquery="INSERT INTO users (alias, email, password, role) VALUES (?, ?, ?, ?);";
			boolean isregister=false;
			int row=0;
			try(Connection c=DBConnection.getConnection()){
				PreparedStatement pre=c.prepareStatement(Registerquery);
				pre.setString(1,alias);
				pre.setString(2,email);
				pre.setString(3,password);
				pre.setString(4,role);
				
				row=pre.executeUpdate();
				if(row>0) {
					isregister=true;
				}
			} catch (SQLException e) {
				System.err.println("JDBC Error during registration: " + e.getMessage());
				e.printStackTrace();
			}
	
			return isregister;
		}
	}
