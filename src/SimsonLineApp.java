import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;

public class SimsonLineApp extends JFrame {
    public SimsonLineApp() {
        setTitle("Die tanzende Simson-Gerade - Extended");
        setSize(1000, 1000);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        add(new SimsonPanel());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new SimsonLineApp().setVisible(true));
    }
}

class SimsonPanel extends JPanel {
    private Point2D[] tri = {
            new Point2D.Double(350, 600),
            new Point2D.Double(650, 600),
            new Point2D.Double(500, 350)
    };
    private double angleP = 0;
    private int dragIdx = -1;
    private boolean draggingP = false;

    public SimsonPanel() {
        setBackground(Color.WHITE);
        MouseAdapter ma = new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                for (int i = 0; i < 3; i++) {
                    if (e.getPoint().distance(tri[i]) < 15) { dragIdx = i; return; }
                }
                Point2D pPos = getPPosition();
                if (e.getPoint().distance(pPos) < 20) { draggingP = true; }
            }
            public void mouseReleased(MouseEvent e) { dragIdx = -1; draggingP = false; }
            public void mouseDragged(MouseEvent e) {
                if (dragIdx != -1) {
                    tri[dragIdx].setLocation(e.getPoint());
                } else if (draggingP) {
                    Point2D center = getCircumcenter();
                    angleP = Math.atan2(e.getY() - center.getY(), e.getX() - center.getX());
                }
                repaint();
            }
        };
        addMouseListener(ma);
        addMouseMotionListener(ma);
    }

    private Point2D getCircumcenter() {
        double x1 = tri[0].getX(), y1 = tri[0].getY();
        double x2 = tri[1].getX(), y2 = tri[1].getY();
        double x3 = tri[2].getX(), y3 = tri[2].getY();
        double d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        if (Math.abs(d) < 0.001) return new Point2D.Double(x1, y1);
        double ux = ((x1 * x1 + y1 * y1) * (y2 - y3) + (x2 * x2 + y2 * y2) * (y3 - y1) + (x3 * x3 + y3 * y3) * (y1 - y2)) / d;
        double uy = ((x1 * x1 + y1 * y1) * (x3 - x2) + (x2 * x2 + y2 * y2) * (x1 - x3) + (x3 * x3 + y3 * y3) * (x2 - x1)) / d;
        return new Point2D.Double(ux, uy);
    }

    private Point2D getPPosition() {
        Point2D c = getCircumcenter();
        double r = c.distance(tri[0]);
        return new Point2D.Double(c.getX() + r * Math.cos(angleP), c.getY() + r * Math.sin(angleP));
    }

    private Point2D getPedalPoint(Point2D p, Point2D a, Point2D b) {
        double x1 = a.getX(), y1 = a.getY(), x2 = b.getX(), y2 = b.getY(), px = p.getX(), py = p.getY();
        double dx = x2 - x1, dy = y2 - y1;
        if (dx == 0 && dy == 0) return a;
        double t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
        return new Point2D.Double(x1 + t * dx, y1 + t * dy);
    }

    private void drawInfiniteLine(Graphics2D g2, Point2D p1, Point2D p2) {
        double dx = p2.getX() - p1.getX();
        double dy = p2.getY() - p1.getY();
        double len = 2000;
        g2.draw(new Line2D.Double(p1.getX() - len * dx, p1.getY() - len * dy, p1.getX() + len * dx, p1.getY() + len * dy));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        Point2D center = getCircumcenter();
        double r = center.distance(tri[0]);
        Point2D pPos = getPPosition();

        // 1. Unendliche Seitenlinien (ganz dünn im Hintergrund)
        g2.setStroke(new BasicStroke(0.5f));
        g2.setColor(new Color(220, 220, 220));
        drawInfiniteLine(g2, tri[0], tri[1]);
        drawInfiniteLine(g2, tri[1], tri[2]);
        drawInfiniteLine(g2, tri[2], tri[0]);

        // 2. Umkreis zeichnen
        g2.setStroke(new BasicStroke(1f));
        g2.setColor(new Color(200, 200, 200));
        g2.draw(new Ellipse2D.Double(center.getX() - r, center.getY() - r, 2 * r, 2 * r));

        // 3. Haupt-Dreieck (deutlich sichtbar)
        g2.setStroke(new BasicStroke(2f));
        g2.setColor(Color.BLACK);
        Path2D path = new Path2D.Double();
        path.moveTo(tri[0].getX(), tri[0].getY());
        path.lineTo(tri[1].getX(), tri[1].getY());
        path.lineTo(tri[2].getX(), tri[2].getY());
        path.closePath();
        g2.draw(path);

        // 4. Lotfußpunkte berechnen
        Point2D f1 = getPedalPoint(pPos, tri[0], tri[1]);
        Point2D f2 = getPedalPoint(pPos, tri[1], tri[2]);
        Point2D f3 = getPedalPoint(pPos, tri[2], tri[0]);

        // 5. Lote zeichnen (gestrichelt)
        g2.setStroke(new BasicStroke(1f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new float[]{5}, 0));
        g2.setColor(new Color(180, 180, 180));
        g2.draw(new Line2D.Double(pPos, f1));
        g2.draw(new Line2D.Double(pPos, f2));
        g2.draw(new Line2D.Double(pPos, f3));

        // 6. DIE SIMSON-GERADE (In Rot, unendlich verlängert)
        g2.setStroke(new BasicStroke(2.5f));
        g2.setColor(new Color(255, 0, 0, 200));
        double dx = f2.getX() - f1.getX(), dy = f2.getY() - f1.getY();
        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
            drawInfiniteLine(g2, f1, f2);
        }

        // 7. Punkte zeichnen
        // Ecken
        g2.setColor(Color.BLUE);
        for (Point2D pt : tri) g2.fill(new Ellipse2D.Double(pt.getX() - 6, pt.getY() - 6, 12, 12));

        // Lotfußpunkte
        g2.setColor(new Color(0, 150, 0));
        g2.fill(new Ellipse2D.Double(f1.getX() - 5, f1.getY() - 5, 10, 10));
        g2.fill(new Ellipse2D.Double(f2.getX() - 5, f2.getY() - 5, 10, 10));
        g2.fill(new Ellipse2D.Double(f3.getX() - 5, f3.getY() - 5, 10, 10));

        // Punkt P
        g2.setColor(Color.MAGENTA);
        g2.fill(new Ellipse2D.Double(pPos.getX() - 8, pPos.getY() - 8, 16, 16));
        g2.setFont(new Font("SansSerif", Font.BOLD, 12));
        g2.drawString("P", (int)pPos.getX() + 12, (int)pPos.getY());

        // Text
        g2.setColor(Color.DARK_GRAY);
        g2.setFont(new Font("SansSerif", Font.BOLD, 14));
        g2.drawString("Simson-Gerade: Die grünen Lotpunkte liegen immer auf der roten Linie.", 20, 30);
        g2.setFont(new Font("SansSerif", Font.PLAIN, 12));
        g2.drawString("Die hellgrauen Linien zeigen die unendliche Verlängerung der Dreiecksseiten.", 20, 50);
    }
}