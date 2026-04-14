import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;

/**
 * Fermat-Labor: Beweis des Optimums & Konstruktion
 * Klasse wurde in FermatOptimumPanel umbenannt, um Namenskollisionen zu vermeiden.
 */
public class FermatPointCompleteApp extends JFrame {
    public FermatPointCompleteApp() {
        setTitle("Fermat-Punkt: Das ultimative Experiment");
        setSize(1000, 950);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        FermatOptimumPanel panel = new FermatOptimumPanel();

        // --- Steuerung oben ---
        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT));
        controls.setBackground(new Color(245, 245, 245));

        JCheckBox cbTriangles = new JCheckBox("Konstruktion (Außendreiecke) zeigen", false);
        cbTriangles.setFont(new Font("SansSerif", Font.BOLD, 12));
        cbTriangles.addActionListener(e -> {
            panel.setShowConstruction(cbTriangles.isSelected());
            panel.repaint();
        });

        JButton btnResetP = new JButton("Punkt P zurücksetzen");
        btnResetP.addActionListener(e -> {
            panel.resetTestPoint();
            panel.repaint();
        });

        controls.add(cbTriangles);
        controls.add(new JSeparator(JSeparator.VERTICAL));
        controls.add(btnResetP);

        add(panel, BorderLayout.CENTER);
        add(controls, BorderLayout.NORTH);

        JLabel help = new JLabel(" Anleitung: Ziehe A, B, C (Blau) oder Punkt P (Violett).");
        help.setFont(new Font("SansSerif", Font.ITALIC, 12));
        add(help, BorderLayout.SOUTH);
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception e) {}
        SwingUtilities.invokeLater(() -> new FermatPointCompleteApp().setVisible(true));
    }
}

// Name geändert von LaborPanel -> FermatOptimumPanel
class FermatOptimumPanel extends JPanel {
    private Point2D[] corners = {
            new Point2D.Double(300, 700), // A
            new Point2D.Double(700, 700), // B
            new Point2D.Double(500, 350)  // C
    };

    private Point2D testPoint = new Point2D.Double(500, 600);
    private boolean showConstruction = false;
    private int dragIdx = -1;
    private boolean draggingP = false;

    public FermatOptimumPanel() {
        setBackground(Color.WHITE);
        MouseAdapter ma = new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                for (int i = 0; i < 3; i++) {
                    if (e.getPoint().distance(corners[i]) < 20) { dragIdx = i; return; }
                }
                if (e.getPoint().distance(testPoint) < 20) {
                    draggingP = true;
                } else {
                    testPoint.setLocation(e.getPoint());
                    repaint();
                }
            }
            @Override
            public void mouseReleased(MouseEvent e) { dragIdx = -1; draggingP = false; }
            @Override
            public void mouseDragged(MouseEvent e) {
                if (dragIdx != -1) corners[dragIdx].setLocation(e.getPoint());
                else if (draggingP) testPoint.setLocation(e.getPoint());
                repaint();
            }
        };
        addMouseListener(ma);
        addMouseMotionListener(ma);
    }

    public void setShowConstruction(boolean b) { this.showConstruction = b; }
    public void resetTestPoint() { testPoint.setLocation(500, 600); }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        Point2D A = corners[0], B = corners[1], C = corners[2];
        Point2D F = calculateFermatPoint(A, B, C);

        Point2D Ap = getEquiPoint(B, C, A);
        Point2D Bp = getEquiPoint(A, C, B);
        Point2D Cp = getEquiPoint(A, B, C);

        // --- LAYER 1: Füllungen ---
        if (showConstruction) {
            fillTriangle(g2, B, C, Ap, new Color(255, 200, 100, 70));
            fillTriangle(g2, A, C, Bp, new Color(255, 200, 100, 70));
            fillTriangle(g2, A, B, Cp, new Color(255, 200, 100, 70));
        }
        fillTriangle(g2, A, B, C, new Color(230, 245, 255));

        // --- LAYER 2: Linien & Umrisse ---
        if (showConstruction) {
            g2.setStroke(new BasicStroke(1.5f));
            g2.setColor(new Color(255, 140, 0));
            g2.draw(new Line2D.Double(B, Ap)); g2.draw(new Line2D.Double(C, Ap));
            g2.draw(new Line2D.Double(A, Bp)); g2.draw(new Line2D.Double(C, Bp));
            g2.draw(new Line2D.Double(A, Cp)); g2.draw(new Line2D.Double(B, Cp));

            g2.setStroke(new BasicStroke(1.2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new float[]{6, 5}, 0));
            g2.setColor(new Color(100, 100, 100));
            g2.draw(new Line2D.Double(A, Ap));
            g2.draw(new Line2D.Double(B, Bp));
            g2.draw(new Line2D.Double(C, Cp));
        }

        g2.setStroke(new BasicStroke(2.5f));
        g2.setColor(Color.BLACK);
        Path2D mainTri = new Path2D.Double();
        mainTri.moveTo(A.getX(), A.getY()); mainTri.lineTo(B.getX(), B.getY()); mainTri.lineTo(C.getX(), C.getY()); mainTri.closePath();
        g2.draw(mainTri);

        // --- LAYER 3: Abstands-Linien ---
        g2.setStroke(new BasicStroke(1.5f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new float[]{8, 6}, 0));
        g2.setColor(new Color(160, 0, 255, 180));
        for (Point2D corner : corners) g2.draw(new Line2D.Double(testPoint, corner));

        g2.setStroke(new BasicStroke(2.5f));
        g2.setColor(new Color(0, 150, 0, 180));
        for (Point2D corner : corners) g2.draw(new Line2D.Double(F, corner));

        // --- LAYER 4: Punkte ---
        drawPt(g2, A, "A", Color.BLUE, 14);
        drawPt(g2, B, "B", Color.BLUE, 14);
        drawPt(g2, C, "C", Color.BLUE, 14);
        drawPt(g2, F, "Fermat (F)", new Color(0, 120, 0), 18);
        drawPt(g2, testPoint, "Punkt (P)", new Color(160, 0, 255), 18);

        if (showConstruction) {
            drawPt(g2, Ap, "A'", Color.ORANGE, 10);
            drawPt(g2, Bp, "B'", Color.ORANGE, 10);
            drawPt(g2, Cp, "C'", Color.ORANGE, 10);
        }

        double sumF = A.distance(F) + B.distance(F) + C.distance(F);
        double sumP = A.distance(testPoint) + B.distance(testPoint) + C.distance(testPoint);
        g2.setFont(new Font("SansSerif", Font.BOLD, 17));
        g2.setColor(new Color(0, 100, 0));
        g2.drawString(String.format("Fermat-Summe (F): %.1f", sumF), 25, 50);
        g2.setColor(new Color(160, 0, 255));
        g2.drawString(String.format("Punkt-Summe (P): %.1f", sumP), 25, 78);
        g2.setColor(sumP - sumF > 0.5 ? Color.RED : Color.BLACK);
        g2.drawString(String.format("Differenz (Umweg): %.1f", Math.max(0, sumP - sumF)), 25, 110);
    }

    private void fillTriangle(Graphics2D g2, Point2D p1, Point2D p2, Point2D p3, Color c) {
        Path2D p = new Path2D.Double();
        p.moveTo(p1.getX(), p1.getY()); p.lineTo(p2.getX(), p2.getY()); p.lineTo(p3.getX(), p3.getY()); p.closePath();
        g2.setColor(c); g2.fill(p);
    }

    private void drawPt(Graphics2D g2, Point2D p, String l, Color c, int s) {
        g2.setColor(c); g2.fill(new Ellipse2D.Double(p.getX()-s/2.0, p.getY()-s/2.0, s, s));
        g2.setColor(Color.BLACK); g2.setFont(new Font("SansSerif", Font.PLAIN, 12));
        g2.drawString(l, (int)p.getX()+14, (int)p.getY()-8);
    }

    private Point2D calculateFermatPoint(Point2D A, Point2D B, Point2D C) {
        if (getAngle(B, A, C) >= 120) return A;
        if (getAngle(A, B, C) >= 120) return B;
        if (getAngle(A, C, B) >= 120) return C;
        return getIntersect(A, getEquiPoint(B,C,A), B, getEquiPoint(A,C,B));
    }

    private Point2D getEquiPoint(Point2D p1, Point2D p2, Point2D ref) {
        double dx = p2.getX()-p1.getX(), dy = p2.getY()-p1.getY();
        double s60 = Math.sin(Math.PI/3), c60 = Math.cos(Math.PI/3);
        Point2D c1 = new Point2D.Double(p1.getX()+dx*c60-dy*s60, p1.getY()+dx*s60+dy*c60);
        Point2D c2 = new Point2D.Double(p1.getX()+dx*c60+dy*s60, p1.getY()-dx*s60+dy*c60);
        return (c1.distance(ref) > c2.distance(ref)) ? c1 : c2;
    }

    private Point2D getIntersect(Point2D p1, Point2D p2, Point2D p3, Point2D p4) {
        double x1=p1.getX(), y1=p1.getY(), x2=p2.getX(), y2=p2.getY(), x3=p3.getX(), y3=p3.getY(), x4=p4.getX(), y4=p4.getY();
        double det = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
        if (Math.abs(det) < 0.0001) return p1;
        return new Point2D.Double(((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/det, ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/det);
    }

    private double getAngle(Point2D p1, Point2D p2, Point2D p3) {
        double a=p2.distance(p3), b=p1.distance(p3), c=p1.distance(p2);
        return Math.toDegrees(Math.acos(Math.max(-1.0, Math.min(1.0, (b*b+c*c-a*a)/(2*b*c)))));
    }
}