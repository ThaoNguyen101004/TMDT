import java.sql.Connection;
import java.sql.DriverManager;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://db.ykgnutyoljducellogkm.supabase.co:5432/postgres?sslmode=require";
        String user = "postgres";
        String password = "Nguyen101004@2004";
        
        try {
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✅ Kết nối thành công!");
            conn.close();
        } catch (Exception e) {
            System.out.println("❌ Kết nối thất bại: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
