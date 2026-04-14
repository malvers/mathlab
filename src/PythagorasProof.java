import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

public class PythagorasProof extends JPanel {

    private final Point2D.Double A, B, C, D;  // Innere Punkte
    private final Point2D.Double a, b, c, d;  // Äußere Quadrateckpunkte

    private final Color darkBlue = new Color(0, 0, 60);
    private final Color lightBlue = new Color(100, 150, 255, 100);

    public enum Direction { TOP, BOTTOM, LEFT, RIGHT }

    private final List<DrawableTriangle> triangles;
    private DrawableTriangle selectedTriangle = null;
    private Point2D.Double dragStart = null;

    private double aLen = 100.0;
    private double sWidth = 600.0;
    private static double frameWidth = 1600.0; // Deine ursprüngliche Breite
    private double x0 = (frameWidth - sWidth) / 2.0;
    private double y0 = 200.0;

    private boolean filled = false;

    public PythagorasProof() {
        // Initialisierung
        a = new Point2D.Double(x0, y0);
        b = new Point2D.Double(x0 + sWidth, y0);
        c = new Point2D.Double(x0 + sWidth, y0 + sWidth);
        d = new Point2D.Double(x0, y0 + sWidth);

        A = new Point2D.Double(x0 + sWidth, y0 + aLen);
        B = new Point2D.Double(x0 + sWidth - aLen, y0 + sWidth);
        C = new Point2D.Double(x0, y0 + sWidth - aLen);
        D = new Point2D.Double(x0 + aLen, y0);

        triangles = new ArrayList<>();

        // Die 4 beweglichen roten Dreiecke
        triangles.add(new DrawableTriangle(x0 + aLen, y0, x0 + sWidth, y0, x0 + sWidth, y0 + aLen));
        triangles.add(new DrawableTriangle(x0 + sWidth, y0 + aLen, x0 + sWidth, y0 + sWidth, x0 + sWidth - aLen, y0 + sWidth));
        triangles.add(new DrawableTriangle(x0 + sWidth - aLen, y0 + sWidth, x0, y0 + sWidth, x0, y0 + sWidth - aLen));
        triangles.add(new DrawableTriangle(x0, y0 + sWidth - aLen, x0, y0, x0 + aLen, y0));

        MouseAdapter mouseAdapter = new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                selectedTriangle = null;
                for (DrawableTriangle triangle : triangles) {
                    if (triangle.contains(e.getPoint())) {
                        selectedTriangle = triangle;
                        dragStart = new Point2D.Double(e.getX(), e.getY());
                        break;
                    }
                }
                repaint();
                requestFocusInWindow();
            }

            @Override
            public void mouseDragged(MouseEvent e) {
                if (selectedTriangle != null && dragStart != null) {
                    double dx = e.getX() - dragStart.x;
                    double dy = e.getY() - dragStart.y;
                    selectedTriangle.translate(dx, dy);
                    dragStart = new Point2D.Double(e.getX(), e.getY());
                    repaint();
                }
            }
            @Override
            public void mouseReleased(MouseEvent e) { dragStart = null; }
        };

        addMouseListener(mouseAdapter);
        addMouseMotionListener(mouseAdapter);
        setFocusable(true);

        addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_F) {
                    filled = !filled;
                } else if (selectedTriangle != null) {
                    double rot = 0;
                    if (e.getKeyCode() == KeyEvent.VK_UP) rot = Math.toRadians(10.0);
                    else if (e.getKeyCode() == KeyEvent.VK_DOWN) rot = Math.toRadians(-10.0);
                    if (rot != 0) selectedTriangle.rotate(rot, selectedTriangle.getCenter());
                }
                repaint();
            }
        });
    }

    private double calculateArea(double x1, double y1, double x2, double y2, double x3, double y3) {
        return Math.abs((x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2)) / 2.0);
    }

    private void drawSubTriangle(Graphics2D g, DrawableTriangle tri, Color outlineColor) {
        if (filled) tri.draw(g, lightBlue);
        tri.drawOutline(g, outlineColor);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);

        // Hintergrund & Blaues Quadrat
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, (int)frameWidth, (int)frameWidth);
        g2d.setColor(Color.BLUE);
        g2d.fill(new Path2D.Double() {{ moveTo(a.x, a.y); lineTo(b.x, b.y); lineTo(c.x, c.y); lineTo(d.x, d.y); closePath(); }});

        DrawableTriangle t0 = triangles.get(0);

        // Die 8 Sub-Dreiecke exakt nach deiner Topologie
        DrawableTriangle[] subs = {
                new DrawableTriangle(C.x, C.y, t0.x1, t0.y1, D.x, D.y),
                new DrawableTriangle(D.x, D.y, t0.x1, t0.y1, A.x, A.y),
                new DrawableTriangle(t0.x1, t0.y1, A.x, A.y, t0.x2, t0.y2),
                new DrawableTriangle(A.x, A.y, t0.x2, t0.y2, B.x, B.y),
                new DrawableTriangle(t0.x2, t0.y2, B.x, B.y, t0.x3, t0.y3),
                new DrawableTriangle(B.x, B.y, C.x, C.y, t0.x3, t0.y3),
                new DrawableTriangle(C.x, C.y, t0.x3, t0.y3, t0.x1, t0.y1),
                new DrawableTriangle(D.x, D.y, A.x, A.y, b.x, b.y)
        };

        for (DrawableTriangle sub : subs) drawSubTriangle(g2d, sub, darkBlue);

        // Rote Dreiecke
        for (DrawableTriangle tri : triangles) {
            if (tri == selectedTriangle) { tri.draw(g2d, Color.ORANGE); tri.drawCornerNumbers(g2d); }
            else tri.draw(g2d, Color.RED);
        }

        // --- DEINE ORIGINAL-LEGENDE (Berechnungen auf Double-Basis) ---
        double a1 = calculateArea(C.x, C.y, t0.x1, t0.y1, D.x, D.y);
        double a2 = calculateArea(D.x, D.y, t0.x1, t0.y1, A.x, A.y);
        double a3 = calculateArea(t0.x1, t0.y1, A.x, A.y, t0.x2, t0.y2);
        double a4 = calculateArea(A.x, A.y, t0.x2, t0.y2, B.x, B.y);
        double a5 = calculateArea(t0.x2, t0.y2, B.x, B.y, t0.x3, t0.y3);
        double a6 = calculateArea(B.x, B.y, C.x, C.y, t0.x3, t0.y3);
        double a7 = calculateArea(C.x, C.y, t0.x3, t0.y3, t0.x1, t0.y1);
        double a8 = calculateArea(D.x, D.y, A.x, A.y, b.x, b.y);
        double sum8 = a1+a2+a3+a4+a5+a6+a7+a8;

        double innerSquare = A.distance(B) * A.distance(B);
        double bigTris = calculateArea(t0.x1, t0.y1, t0.x2, t0.y2, t0.x3, t0.y3) * 4.0;
        double blueArea = sWidth * sWidth;

        g2d.setColor(Color.BLACK);
        int yLine = 20, xLine = 10;
        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        g2d.drawString("=== PYTHAGORAS BEWEIS ===", xLine, yLine); yLine += 22;
        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        g2d.drawString("Die 8 Teildreiecke:", xLine, yLine); yLine += 16;
        g2d.setFont(new Font("Monospaced", Font.PLAIN, 10));
        String[] fmt = {"C1D", "D1A", "1A2", "A2B", "2B3", "BC3", "C31", "DAb"};
        double[] vals = {a1, a2, a3, a4, a5, a6, a7, a8};
        for(int i=0; i<8; i++) {
            g2d.drawString(String.format("%d. %-4s = %10.2f", i+1, fmt[i], vals[i]), xLine+10, yLine); yLine += 14;
        }
        yLine += 2;
        g2d.setFont(new Font("Arial", Font.BOLD, 11));
        g2d.drawString(String.format("SUMME 8 Teildreiecke = %10.2f", sum8), xLine+10, yLine); yLine += 20;

        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        g2d.drawString("Weitere Flächen:", xLine, yLine); yLine += 16;
        g2d.setFont(new Font("Monospaced", Font.PLAIN, 10));
        g2d.drawString(String.format("Inneres Quadrat ABDC = %10.2f", innerSquare), xLine+10, yLine); yLine += 14;
        g2d.drawString(String.format("4 große rote Dreiecke = %10.2f", bigTris), xLine+10, yLine); yLine += 14;
        g2d.drawString(String.format("Äußeres blaues Quadrat = %10.2f", blueArea), xLine+10, yLine); yLine += 18;

        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        g2d.drawString("=== VERGLEICH ===", xLine, yLine); yLine += 18;
        g2d.setFont(new Font("Monospaced", Font.PLAIN, 10));
        g2d.drawString(String.format("Inneres Quadrat + 4 Dreiecke = %.2f + %.2f = %.2f",
                innerSquare, bigTris, innerSquare + bigTris), xLine+10, yLine); yLine += 14;
        g2d.drawString(String.format("Äußeres Quadrat = %.2f", blueArea), xLine+10, yLine); yLine += 14;

        if (Math.abs(innerSquare + bigTris - blueArea) < 0.1) {
            g2d.setFont(new Font("Arial", Font.BOLD, 12)); g2d.setColor(new Color(0, 150, 0));
            g2d.drawString("✓ BEWIESEN: (a+b)² = c² + 4×(ab/2)", xLine, yLine + 10);
            g2d.drawString("  → a² + 2ab + b² = c² + 2ab", xLine, yLine + 24);
            g2d.drawString("  → a² + b² = c²", xLine, yLine + 38);
        }

        // Punkte
        g2d.setColor(darkBlue); g2d.setFont(new Font("Arial", Font.PLAIN, 12));
        drawPoint(g2d, a, "a", Direction.TOP); drawPoint(g2d, b, "b", Direction.TOP);
        drawPoint(g2d, c, "c", Direction.BOTTOM); drawPoint(g2d, d, "d", Direction.BOTTOM);
        drawPoint(g2d, A, "A", Direction.RIGHT); drawPoint(g2d, B, "B", Direction.BOTTOM);
        drawPoint(g2d, C, "C", Direction.LEFT); drawPoint(g2d, D, "D", Direction.TOP);
    }

    private void drawPoint(Graphics2D g, Point2D.Double p, String letter, Direction dir) {
        g.fillOval((int)p.x - 4, (int)p.y - 4, 8, 8);
        int off = 16;
        int lx = (int)p.x, ly = (int)p.y;
        if(dir==Direction.TOP) ly-=off; else if(dir==Direction.BOTTOM) ly+=off;
        else if(dir==Direction.LEFT) lx-=off+4; else lx+=off;
        g.drawString(letter, lx, ly);
    }

    public static void main(String[] args) {
        JFrame f = new JFrame(); f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setSize((int)frameWidth, 1000); f.add(new PythagorasProof()); f.setVisible(true);
    }

    public class DrawableTriangle {
        public double x1, y1, x2, y2, x3, y3;
        public DrawableTriangle(double x1, double y1, double x2, double y2, double x3, double y3) {
            this.x1=x1; this.y1=y1; this.x2=x2; this.y2=y2; this.x3=x3; this.y3=y3;
        }
        public Path2D.Double getPath() {
            Path2D.Double p = new Path2D.Double(); p.moveTo(x1,y1); p.lineTo(x2,y2); p.lineTo(x3,y3); p.closePath(); return p;
        }
        public void draw(Graphics2D g, Color c) { g.setColor(c); g.fill(getPath()); }
        public void drawOutline(Graphics2D g, Color c) { g.setColor(c); g.draw(getPath()); }
        public void drawCornerNumbers(Graphics2D g) {
            g.setColor(Color.BLACK); g.setFont(new Font("Arial", Font.BOLD, 14));
            g.drawString("1", (int)x1 - 8, (int)y1 - 8); g.drawString("2", (int)x2 + 5, (int)y2 - 8); g.drawString("3", (int)x3 - 8, (int)y3 + 15);
        }
        public void translate(double dx, double dy) { x1+=dx; y1+=dy; x2+=dx; y2+=dy; x3+=dx; y3+=dy; }
        public void rotate(double ang, Point2D.Double c) {
            Point2D.Double p1 = rot(x1,y1,c,ang); Point2D.Double p2 = rot(x2,y2,c,ang); Point2D.Double p3 = rot(x3,y3,c,ang);
            x1=p1.x; y1=p1.y; x2=p2.x; y2=p2.y; x3=p3.x; y3=p3.y;
        }
        private Point2D.Double rot(double px, double py, Point2D.Double c, double a) {
            double dx = px-c.x, dy = py-c.y;
            return new Point2D.Double(c.x + dx*Math.cos(a)-dy*Math.sin(a), c.y + dx*Math.sin(a)+dy*Math.cos(a));
        }
        public Point2D.Double getCenter() { return new Point2D.Double((x1+x2+x3)/3.0, (y1+y2+y3)/3.0); }
        public boolean contains(Point p) { return getPath().contains(p); }
    }
}