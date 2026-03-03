package Day3;
import java.sql.*;

public class Studentsaver {
    static void Studentsave(Student student) {
        try{
            Connection con=ConnetionFactory.getConnection();
            String q="INSERT INTO Student VALUES(?,?)";
            PreparedStatement ps=con.prepareStatement(q);
            ps.setString(1,student.getName());
            ps.setString(2,student.getCourse());
            ps.execute();
        }
        catch(Exception e){
            System.out.println(e);
        }
    }
}
