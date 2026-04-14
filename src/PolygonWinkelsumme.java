import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import java.util.ArrayList;
import java.util.List;

public class PolygonWinkelsumme extends JPanel {
    private List<Point2D> punkte;
    private int selectedIdx = -1;
    private final int BOGEN_RAD = 50;
    private final Color[] farben = {
            new Color(255, 50, 50, 180), new Color(50, 255, 50, 180),
            new Color(50, 50, 255, 180), new Color(255, 200, 0, 180),
            new Color(0, 255, 255, 180), new Color(255, 0, 255, 180),
            new Color(150, 75, 0, 180), new Color(0, 150, 0, 180), Color.GRAY
    };

    public PolygonWinkelsumme() {
        setFocusable(true);
        initPolygon(3);
        MouseAdapter ma = new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                for (int i = 0; i < punkte.size(); i++)
                    if (e.getPoint().distance(punkte.get(i)) < 20) { selectedIdx = i; break; }
            }
            public void mouseReleased(MouseEvent e) { selectedIdx = -1; }
            public void mouseDragged(MouseEvent e) {
                if (selectedIdx != -1) { punkte.get(selectedIdx).setLocation(e.getPoint()); repaint(); }
            }
        };
        addMouseListener(ma);
        addMouseMotionListener(ma);
        addKeyListener(new KeyAdapter() {
            public void keyPressed(KeyEvent e) {
                int n = e.getKeyChar() - '0';
                if (n >= 3 && n <= 9) { initPolygon(n); repaint(); }
            }
        });
    }

    private void initPolygon(int n) {
        punkte = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            double a = 2 * Math.PI * i / n - Math.PI / 2;
            punkte.add(new Point2D.Double(250 + 100 * Math.cos(a), 250 + 100 * Math.sin(a)));
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int n = punkte.size();
        double[] innenWinkel = new double[n];
        double summe = 0;

        // Polygon-Pfad für den "Enthält Punkt"-Check
        Path2D.Double poly = new Path2D.Double();
        poly.moveTo(punkte.get(0).getX(), punkte.get(0).getY());
        for(int i=1; i<n; i++) poly.lineTo(punkte.get(i).getX(), punkte.get(i).getY());
        poly.closePath();

        for (int i = 0; i < n; i++) {
            Point2D p = punkte.get(i);
            Point2D pP = punkte.get((i + n - 1) % n);
            Point2D pN = punkte.get((i + 1) % n);

            // Absolute Winkel der Linien
            double angP = Math.toDegrees(Math.atan2(pP.getY() - p.getY(), pP.getX() - p.getX()));
            double angN = Math.toDegrees(Math.atan2(pN.getY() - p.getY(), pN.getX() - p.getX()));

            // Wir versuchen den Bogen von Linie P zu Linie N
            double start = angP;
            double ausdehnung = angN - angP;

            // Normalisieren auf [0, 360]
            while (ausdehnung < 0) ausdehnung += 360;
            while (ausdehnung > 360) ausdehnung -= 360;

            // TEST: Liegt die Mitte des Bogens im Polygon?
            double testAng = Math.toRadians(start + ausdehnung / 2.0);
            Point2D testPunkt = new Point2D.Double(p.getX() + 10 * Math.cos(testAng), p.getY() + 10 * Math.sin(testAng));

            if (!poly.contains(testPunkt)) {
                // Wenn nicht, ist es der Außenwinkel -> nimm den anderen Weg
                start = angN;
                ausdehnung = 360 - ausdehnung;
            }

            innenWinkel[i] = ausdehnung;
            summe += ausdehnung;

            // Zeichnen am Polygon (Y-Achse in Java ist invertiert für Arcs)
            g2.setColor(farben[i % farben.length]);
            g2.fill(new Arc2D.Double(p.getX()-BOGEN_RAD, p.getY()-BOGEN_RAD, 2*BOGEN_RAD, 2*BOGEN_RAD, -start, -ausdehnung, Arc2D.PIE));
        }

        // Linien und Punkte
        g2.setColor(Color.BLACK);
        g2.setStroke(new BasicStroke(2));
        g2.draw(poly);
        for (Point2D p : punkte) g2.fill(new Ellipse2D.Double(p.getX()-4, p.getY()-4, 8, 8));

        // Zusammengelegte Winkel (nur für n=3 und n=4)
        if (n <= 4) {
            double cur = 180;
            g2.setColor(Color.LIGHT_GRAY);
            g2.drawLine(150, 500, 350, 500);
            for (int i = 0; i < n; i++) {
                g2.setColor(farben[i % farben.length]);
                g2.fill(new Arc2D.Double(250-BOGEN_RAD, 500-BOGEN_RAD, 2*BOGEN_RAD, 2*BOGEN_RAD, cur, -innenWinkel[i], Arc2D.PIE));
                cur -= innenWinkel[i];
            }
        }

        g2.setColor(Color.BLACK);
        g2.setFont(new Font("Arial", Font.BOLD, 16));
        g2.drawString("Winkelsumme: " + Math.round(summe) + "°", 180, 580);
        g2.setFont(new Font("Arial", Font.PLAIN, 12));
        g2.drawString("Drücke Tasten 3-9 für Ecken", 10, 20);
    }

    public static void main(String[] args) {
        JFrame f = new JFrame("Geometrie Fix");
        f.add(new PolygonWinkelsumme());
        f.setSize(500, 650);
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setLocationRelativeTo(null);
        f.setVisible(true);
    }
}