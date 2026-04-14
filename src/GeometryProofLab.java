import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

public class GeometryProofLab extends JFrame {
    public GeometryProofLab() {
        setTitle("Finaler Geometrie-Beweis: Wechselwinkel α = β");
        setSize(1150, 850);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("1. Translation & Doppel-Nebenwinkel", new TranslationPanel());
        tabs.addTab("2. Punktspiegelung (Symmetrie)", new MirrorPanel());

        add(tabs);
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception e) {}
        SwingUtilities.invokeLater(() -> new GeometryProofLab().setVisible(true));
    }
}

// --- BASIS-KLASSE FÜR GEOMETRIE ---
abstract class BaseProofPanel extends JPanel {
    protected Point2D A = new Point2D.Double(350, 550);
    protected Point2D B = new Point2D.Double(650, 250);
    protected double angleDeg;

    public BaseProofPanel() {
        setBackground(Color.WHITE);
        // Berechnet den Steigungswinkel der Schnittgeraden
        angleDeg = Math.toDegrees(Math.atan2(-(B.getY() - A.getY()), B.getX() - A.getX()));
    }

    protected void drawBaseSetup(Graphics2D g2) {
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setStroke(new BasicStroke(1.5f));
        g2.setColor(new Color(220, 220, 220));
        g2.draw(new Line2D.Double(50, B.getY(), 1100, B.getY())); // Gerade g
        g2.draw(new Line2D.Double(50, A.getY(), 1100, A.getY())); // Gerade h

        g2.setColor(new Color(180, 180, 180));
        double dx = B.getX() - A.getX(), dy = B.getY() - A.getY();
        g2.draw(new Line2D.Double(A.getX() - dx*0.7, A.getY() - dy*0.7, B.getX() + dx*0.7, B.getY() + dy*0.7));
    }

    protected void drawAngle(Graphics2D g2, Point2D center, double start, double extent, String label, Color c, int r) {
        g2.setColor(c);
        g2.setStroke(new BasicStroke(3.5f));
        g2.draw(new Arc2D.Double(center.getX() - r/2.0, center.getY() - r/2.0, r, r, start, extent, Arc2D.OPEN));

        double midRad = Math.toRadians(start + extent / 2.0);
        g2.setFont(new Font("SansSerif", Font.BOLD, 20));
        g2.drawString(label, (int)(center.getX() + r*0.75*Math.cos(midRad)), (int)(center.getY() - r*0.75*Math.sin(midRad)));
    }
}

// --- BEWEIS 1: TRANSLATION MIT GAMMA "UNTEN RUM" ---
class TranslationPanel extends BaseProofPanel {
    private double t = 0;
    public TranslationPanel() {
        setLayout(new BorderLayout());
        JSlider slider = new JSlider(0, 100, 0);
        slider.addChangeListener(e -> { t = slider.getValue()/100.0; repaint(); });
        add(slider, BorderLayout.SOUTH);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        drawBaseSetup(g2);

        double dx = B.getX() - A.getX(), dy = B.getY() - A.getY();
        Point2D At = new Point2D.Double(A.getX() + dx * t, A.getY() + dy * t);

        // 1. Beta (Immer sichtbar, unten links)
        drawAngle(g2, B, 180, angleDeg, "β", new Color(0, 150, 0), 80);

        // 2. Alpha (Original unten)
        drawAngle(g2, A, 0, angleDeg, "α", Color.RED, 80);

        // 3. Alpha' (Stufenwinkel, wandert hoch)
        drawAngle(g2, At, 0, angleDeg, "α'", new Color(255, 0, 0, 100), 80);

        // 4. Die Doppel-Nebenwinkel-Logik
        if (t > 0.98) {
            // GAMMA 1: Oben auf Gerade g (Nebenwinkel zu α')
            drawAngle(g2, B, angleDeg, 180 - angleDeg, "γ", new Color(255, 200, 0), 100);

            // GAMMA 2: Unten auf der Schnittgeraden (Nebenwinkel zu β)
            // Wir zeichnen den Bogen "unten rum" von der Schnittgeraden (180+angleDeg) bis zur Geraden g (360)
            g2.setStroke(new BasicStroke(2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_ROUND, 10f, new float[]{5f}, 0f));
            drawAngle(g2, B, 180 + angleDeg, 180 - angleDeg, "", new Color(255, 140, 0), 115);

            // Beweistext
            g2.setColor(Color.BLACK);
            g2.setFont(new Font("SansSerif", Font.BOLD, 18));
            g2.drawString("Der lückenlose Beweis:", 480, 70);
            g2.setFont(new Font("SansSerif", Font.PLAIN, 16));
            g2.drawString("I.  α' + γ = 180° (Nebenwinkel oben auf Gerade g)", 480, 110);
            g2.drawString("II. β + γ = 180° (Nebenwinkel unten auf der Schnittgeraden)", 480, 140);

            g2.setColor(new Color(0, 120, 0));
            g2.setFont(new Font("SansSerif", Font.BOLD, 16));
            g2.drawString("=> Da beides 180° ergibt, folgt zwingend: α' = β", 480, 190);
        }
    }
}

// --- BEWEIS 2: PUNKTSPIEGELUNG ---
class MirrorPanel extends BaseProofPanel {
    private double anim = 0;
    public MirrorPanel() {
        setLayout(new BorderLayout());
        JSlider slider = new JSlider(0, 100, 0);
        slider.addChangeListener(e -> { anim = slider.getValue()/100.0; repaint(); });
        add(slider, BorderLayout.SOUTH);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        drawBaseSetup(g2);

        Point2D M = new Point2D.Double((A.getX()+B.getX())/2, (A.getY()+B.getY())/2);
        drawAngle(g2, B, 180, angleDeg, "β", new Color(0, 150, 0), 80);

        AffineTransform old = g2.getTransform();
        g2.rotate(Math.toRadians(180 * anim), M.getX(), M.getY());
        drawAngle(g2, A, 0, angleDeg, "α", new Color(255, 0, 0, 160), 80);
        g2.setTransform(old);

        g2.setColor(Color.MAGENTA);
        g2.fill(new Ellipse2D.Double(M.getX()-6, M.getY()-6, 12, 12));
        g2.drawString("Spiegelzentrum M", (int)M.getX()+15, (int)M.getY());
    }
}