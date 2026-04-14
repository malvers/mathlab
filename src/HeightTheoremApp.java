import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;

public class HeightTheoremApp extends JFrame {

    public HeightTheoremApp() {
        setTitle("Höhensatz interaktiv (mit Verständnis)");
        setSize(900, 700);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        add(new DrawPanel());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new HeightTheoremApp().setVisible(true));
    }
}

class DrawPanel extends JPanel {

    Point2D A = new Point2D.Double(150, 500);
    Point2D B = new Point2D.Double(700, 500);
    Point2D C = new Point2D.Double(400, 200);

    int drag = -1;

    public DrawPanel() {

        MouseAdapter ma = new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                if (e.getPoint().distance(A) < 15) drag = 0;
                else if (e.getPoint().distance(B) < 15) drag = 1;
                else if (e.getPoint().distance(C) < 15) drag = 2;
            }

            public void mouseReleased(MouseEvent e) {
                drag = -1;
            }

            public void mouseDragged(MouseEvent e) {
                if (drag == 0) A.setLocation(e.getPoint());
                if (drag == 1) B.setLocation(e.getPoint());
                if (drag == 2) C.setLocation(e.getPoint());
                repaint();
            }
        };

        addMouseListener(ma);
        addMouseMotionListener(ma);
    }

    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;

        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);

        // 🔠 große Schrift
        g2.setFont(new Font("Arial", Font.BOLD, 22));

        // Dreieck
        g2.setColor(Color.BLACK);
        g2.draw(new Line2D.Double(A, B));
        g2.draw(new Line2D.Double(A, C));
        g2.draw(new Line2D.Double(B, C));

        // Höhe
        Point2D foot = footPoint(C, A, B);

        g2.setColor(Color.RED);
        g2.setStroke(new BasicStroke(2));
        g2.draw(new Line2D.Double(C, foot));

        // Punkte
        drawPoint(g2, A, "A");
        drawPoint(g2, B, "B");
        drawPoint(g2, C, "C");
        drawPoint(g2, foot, "F");

        // Längen
        double h = C.distance(foot);
        double p = A.distance(foot);
        double q = B.distance(foot);

        double h2 = h * h;
        double pq = p * q;

        // 🔵 Werte
        g2.setColor(new Color(0, 80, 180));
        g2.drawString(String.format("h = %.2f", h), 40, 60);
        g2.drawString(String.format("p = %.2f", p), 40, 90);
        g2.drawString(String.format("q = %.2f", q), 40, 120);

        // 🔴 vs 🟢 Vergleich
        g2.setColor(new Color(180, 0, 0));
        g2.drawString(String.format("h² = %.2f", h2), 40, 170);

        g2.setColor(Color.BLACK);
        g2.drawString("≈", 180, 170);

        g2.setColor(new Color(0, 120, 0));
        g2.drawString(String.format("p·q = %.2f", pq), 220, 170);

        // 📐 Prüfe rechten Winkel bei C
        double angleC = angle(A, C, B);

        boolean isRight = Math.abs(angleC - 90) < 1.0;

        // Statusanzeige
        if (isRight) {
            g2.setColor(new Color(0, 150, 0));
            g2.drawString("✅ Höhensatz gilt (rechter Winkel)", 40, 220);
        } else {
            g2.setColor(Color.RED);
            g2.drawString("❌ Kein rechter Winkel → gilt NICHT", 40, 220);
        }

        // Winkel bei C anzeigen
        g2.setColor(Color.BLACK);
        g2.drawString(String.format("∠C = %.1f°", angleC), 40, 260);
    }

    private Point2D footPoint(Point2D P, Point2D A, Point2D B) {
        double ax = A.getX(), ay = A.getY();
        double bx = B.getX(), by = B.getY();
        double px = P.getX(), py = P.getY();

        double dx = bx - ax;
        double dy = by - ay;

        double t = ((px - ax)*dx + (py - ay)*dy) / (dx*dx + dy*dy);

        return new Point2D.Double(ax + t*dx, ay + t*dy);
    }

    private double angle(Point2D p1, Point2D center, Point2D p2) {
        double a = center.distance(p2);
        double b = p1.distance(p2);
        double c = p1.distance(center);
        return Math.toDegrees(Math.acos((b*b + c*c - a*a) / (2*b*c)));
    }

    private void drawPoint(Graphics2D g2, Point2D p, String name) {
        g2.setColor(Color.BLACK);
        g2.fill(new Ellipse2D.Double(p.getX()-6, p.getY()-6, 12, 12));
        g2.drawString(name, (int)p.getX()+10, (int)p.getY()-10);
    }
}