import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.File;

public class GeometrieMasterPro extends JPanel {
    private static final int SCALE = 120;
    private static final int OFFSET = 150;
    private static final double TOLERANCE = 8.0;

    private Point2D.Double pGreen = new Point2D.Double();
    private Point2D.Double pRed = new Point2D.Double();
    private Point2D.Double pBlue = new Point2D.Double();

    private Point2D.Double selected = null;
    private boolean isDragging = false;
    private Timer loopTimer;
    private int loopIdx = 0;

    private final int[][] daten = {
            {2, 6}, {2, 1}, {2, 4}, {1, 3}, {3, 2}, {3, 1}, {3, 0}, {2, 3},
            {4, 2}, {4, 1}, {4, 0}, {3, 3}, {5, 2}, {5, 1}, {5, 0}, {4, 3}
    };

    public GeometrieMasterPro() {
        setBackground(Color.WHITE);
        setFocusable(true);

        // Initialer Stand (2|6)
        applyCoords(daten[0][0], daten[0][1]);

        loopTimer = new Timer(500, e -> {
            loopIdx = (loopIdx + 1) % daten.length;
            applyCoords(daten[loopIdx][0], daten[loopIdx][1]);
            saveScreenshot();
            repaint();
        });

        MouseAdapter ma = new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                loopTimer.stop();
                if (pGreen.distance(e.getPoint()) < 40) selected = pGreen;
                else if (pRed.distance(e.getPoint()) < 40) selected = pRed;
                else if (pBlue.distance(e.getPoint()) < 40) selected = pBlue;
                if (selected != null) isDragging = true;
            }
            public void mouseReleased(MouseEvent e) {
                selected = null; isDragging = false; repaint();
            }
            public void mouseDragged(MouseEvent e) {
                if (selected != null) {
                    selected.setLocation(e.getPoint());
                    repaint();
                }
            }
        };
        addMouseListener(ma);
        addMouseMotionListener(ma);

        addKeyListener(new KeyAdapter() {
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_SPACE) {
                    if (loopTimer.isRunning()) loopTimer.stop();
                    else loopTimer.start();
                } else if (e.getKeyCode() == KeyEvent.VK_RIGHT || e.getKeyCode() == KeyEvent.VK_UP) {
                    loopTimer.stop(); loopIdx = (loopIdx + 1) % daten.length;
                    applyCoords(daten[loopIdx][0], daten[loopIdx][1]);
                } else if (e.getKeyCode() == KeyEvent.VK_LEFT || e.getKeyCode() == KeyEvent.VK_DOWN) {
                    loopTimer.stop(); loopIdx = (loopIdx - 1 + daten.length) % daten.length;
                    applyCoords(daten[loopIdx][0], daten[loopIdx][1]);
                }
                repaint();
            }
        });
    }

    private void applyCoords(int x, int y) {
        int h = getHeight() > 0 ? getHeight() : 1000;
        pGreen.setLocation(OFFSET + x * SCALE, h - OFFSET);
        pRed.setLocation(OFFSET, h - OFFSET - y * SCALE);
        pBlue.setLocation(OFFSET + 7 * SCALE, h - OFFSET - 4 * SCALE);
    }

    private void saveScreenshot() {
        BufferedImage img = new BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = img.createGraphics();
        this.paint(g2);
        g2.dispose();
        try { ImageIO.write(img, "png", new File("export_" + loopIdx + ".png")); } catch (Exception e) {}
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        int h = getHeight(), baseLineY = h - OFFSET;

        drawGrid(g2, baseLineY);

        double a = pRed.distance(pBlue), b = pGreen.distance(pBlue), c = pGreen.distance(pRed);
        double angA = Math.toDegrees(Math.acos((b*b + c*c - a*a) / (2*b*c)));
        double angB = Math.toDegrees(Math.acos((a*a + c*c - b*b) / (2*a*c)));
        double angG = 180 - angA - angB;

        // 180° Anzeige oben
        drawSumArc(g2, angA, angB, angG);

        // Dreieck & Ecken-Winkel
        g2.setStroke(new BasicStroke(4)); g2.setColor(new Color(50, 50, 50));
        g2.drawPolygon(new int[]{(int)pGreen.x, (int)pRed.x, (int)pBlue.x}, new int[]{(int)pGreen.y, (int)pRed.y, (int)pBlue.y}, 3);
        drawAngle(g2, pGreen, pRed, pBlue, 70, new Color(126, 211, 33, 180));
        drawAngle(g2, pRed, pBlue, pGreen, 70, new Color(245, 166, 35, 180));
        drawAngle(g2, pBlue, pGreen, pRed, 70, new Color(208, 2, 27, 180));

        // Zahlen-Logik (nur bei Gitter-Kontakt und kein Dragging)
        if (!isDragging && isOnGrid(pGreen) && isOnGrid(pRed) && isOnGrid(pBlue)) {
            int xV = (int)Math.round((pGreen.x-OFFSET)/SCALE), yV = (int)Math.round((baseLineY-pRed.y)/SCALE);
            g2.setFont(new Font("Arial", Font.BOLD, 100));
            g2.setColor(new Color(126, 211, 33)); g2.drawString(""+xV, (int)pGreen.x-25, baseLineY+115);
            g2.setColor(new Color(150, 0, 0)); g2.drawString(""+yV, OFFSET-135, (int)pRed.y+35);

            // Mittelbox
            int mx = (int)(pGreen.x+pRed.x+pBlue.x)/3, my = (int)(pGreen.y+pRed.y+pBlue.y)/3;
            g2.setColor(Color.WHITE); g2.fillRect(mx-70, my-60, 140, 120);
            g2.setColor(Color.LIGHT_GRAY); g2.drawRect(mx-70, my-60, 140, 120);
            g2.setFont(new Font("Arial", Font.BOLD, 80));
            g2.setColor(new Color(126, 211, 33)); g2.drawString(""+xV, mx-60, my+30);
            g2.setColor(new Color(150, 0, 0)); g2.drawString(""+yV, mx+5, my+30);
        }
    }

    private boolean isOnGrid(Point2D.Double p) {
        double gx = (p.x-OFFSET)/SCALE, gy = (getHeight()-OFFSET-p.y)/SCALE;
        return Math.abs(gx-Math.round(gx))*SCALE < TOLERANCE && Math.abs(gy-Math.round(gy))*SCALE < TOLERANCE;
    }

    private void drawSumArc(Graphics2D g2, double a, double b, double g) {
        int r = 100, x = getWidth()/2, y = 130;
        g2.setColor(new Color(126, 211, 33, 220)); g2.fill(new Arc2D.Double(x-r, y-r, r*2, r*2, 0, a, Arc2D.PIE));
        g2.setColor(new Color(245, 166, 35, 220)); g2.fill(new Arc2D.Double(x-r, y-r, r*2, r*2, a, b, Arc2D.PIE));
        g2.setColor(new Color(208, 2, 27, 220)); g2.fill(new Arc2D.Double(x-r, y-r, r*2, r*2, a+b, g, Arc2D.PIE));
    }

    private void drawGrid(Graphics2D g2, int baseLineY) {
        g2.setStroke(new BasicStroke(1));
        for (int i = 0; i <= 20; i++) {
            int x = OFFSET + i * SCALE, y = baseLineY - i * SCALE;
            g2.setColor(new Color(235, 245, 255));
            if (x <= getWidth()) g2.drawLine(x, 0, x, baseLineY);
            if (y >= 0) g2.drawLine(OFFSET, y, getWidth(), y);
            g2.setColor(Color.LIGHT_GRAY); g2.setFont(new Font("Arial", Font.PLAIN, 18));
            if (i <= 15) g2.drawString(""+i, x-5, baseLineY+25);
            if (i <= 10) g2.drawString(""+i, OFFSET-30, y+5);
        }
        g2.setStroke(new BasicStroke(4));
        g2.setColor(new Color(150, 0, 0)); g2.drawLine(OFFSET, 0, OFFSET, baseLineY);
        g2.setColor(new Color(126, 211, 33)); g2.drawLine(OFFSET, baseLineY, getWidth(), baseLineY);
    }

    private void drawAngle(Graphics2D g2, Point2D.Double v, Point2D.Double p1, Point2D.Double p2, double r, Color c) {
        double a1 = Math.atan2(p1.y-v.y, p1.x-v.x), a2 = Math.atan2(p2.y-v.y, p2.x-v.x);
        double s = -Math.toDegrees(a1), e = -Math.toDegrees(a2)-s;
        while (e < -180) e += 360; while (e > 180) e -= 360;
        g2.setColor(c); g2.fill(new Arc2D.Double(v.x-r, v.y-r, r*2, r*2, s, e, Arc2D.PIE));
    }

    public static void main(String[] args) {
        JFrame f = new JFrame(); f.setDefaultCloseOperation(3);
        f.add(new GeometrieMasterPro()); f.setSize(1600, 1000); f.setVisible(true);
    }
}