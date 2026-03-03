package Day3;
import java.sql.*;

public class Studentsaver {
    static void Studentsave(Student student) {
        String query = "INSERT INTO Student VALUES(?, ?)";
        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {

            ps.setString(1, student.getName());
            ps.setString(2, student.getCourse());
            ps.execute();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save student: " + student, e);
        }
    }
}
