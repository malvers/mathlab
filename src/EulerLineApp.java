import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;

public class EulerLineApp extends JFrame {

    private JCheckBox cbEuler, cbUmkreis, cbFeuerbach, cbInkreis, cb9Points, cbFermat, hS, hU, hH, hI;

    public EulerLineApp() {
        setTitle("Euler-Labor & Napoleon-Dreiecke (Fermat-Punkt)");
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        EulerPanel panel = new EulerPanel();

        JPanel topBar = new JPanel(new GridLayout(2, 1));

        JPanel mainControls = new JPanel(new FlowLayout(FlowLayout.LEFT));
        mainControls.setBackground(new Color(230, 230, 230));
        cbEuler = new JCheckBox("Euler-Gerade", true);
        cbUmkreis = new JCheckBox("Umkreis", false);
        cbFeuerbach = new JCheckBox("Feuerbachkreis", false);
        cbInkreis = new JCheckBox("Inkreis", false);
        cb9Points = new JCheckBox("9 Punkte (Feuerbach)", false);
        cbFermat = new JCheckBox("Fermat-Punkt (Napoleon)", false);
        JButton btnReset = new JButton("Reset (Gleichseitig)");

        JPanel helperControls = new JPanel(new FlowLayout(FlowLayout.LEFT));
        helperControls.setBackground(new Color(245, 245, 245));
        helperControls.setBorder(BorderFactory.createTitledBorder("Hilfslinien & Shift-Info"));
        hS = new JCheckBox("Seitenhalbierende (S)");
        hU = new JCheckBox("Mittelsenkrechte (U)");
        hH = new JCheckBox("Höhen (H)");
        hI = new JCheckBox("Winkelhalbierende (I)");
        JLabel shiftInfo = new JLabel(" |  Halte SHIFT zum vertikalen Einrasten");
        shiftInfo.setFont(new Font("SansSerif", Font.ITALIC, 11));

        ActionListener al = e -> {
            panel.showEuler = cbEuler.isSelected();
            panel.showUmkreis = cbUmkreis.isSelected();
            panel.showFeuerbach = cbFeuerbach.isSelected();
            panel.showInkreis = cbInkreis.isSelected();
            panel.show9Points = cb9Points.isSelected();
            panel.showFermat = cbFermat.isSelected();
            panel.hS = hS.isSelected();
            panel.hU = hU.isSelected();
            panel.hH = hH.isSelected();
            panel.hI = hI.isSelected();
            panel.repaint();
        };

        cbEuler.addActionListener(al); cbUmkreis.addActionListener(al);
        cbFeuerbach.addActionListener(al); cbInkreis.addActionListener(al);
        cb9Points.addActionListener(al); cbFermat.addActionListener(al);
        hS.addActionListener(al); hU.addActionListener(al);
        hH.addActionListener(al); hI.addActionListener(al);

        btnReset.addActionListener(e -> {
            panel.resetToEquilateral();
            cbEuler.setSelected(true); cbUmkreis.setSelected(false);
            cbFeuerbach.setSelected(false); cbInkreis.setSelected(false);
            cb9Points.setSelected(false); cbFermat.setSelected(false);
            hS.setSelected(false); hU.setSelected(false); hH.setSelected(false); hI.setSelected(false);
            al.actionPerformed(null);
        });

        mainControls.add(cbEuler); mainControls.add(cbUmkreis);
        mainControls.add(cbFeuerbach); mainControls.add(cbInkreis);
        mainControls.add(cb9Points); mainControls.add(cbFermat);
        mainControls.add(new JSeparator(JSeparator.VERTICAL)); mainControls.add(btnReset);

        helperControls.add(hS); helperControls.add(hU); helperControls.add(hH); helperControls.add(hI);
        helperControls.add(shiftInfo);

        topBar.add(mainControls); topBar.add(helperControls);
        add(topBar, BorderLayout.NORTH);
        add(panel, BorderLayout.CENTER);
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception e) {}
        SwingUtilities.invokeLater(() -> new EulerLineApp().setVisible(true));
    }

    public static class EulerPanel extends JPanel {
        private Point2D[] p = new Point2D[3];
        private int dragIdx = -1;
        public boolean showEuler=true, showUmkreis=false, showFeuerbach=false, showInkreis=false, show9Points=false, showFermat=false;
        public boolean hS=false, hU=false, hH=false, hI=false;

        public EulerPanel() {
            setBackground(Color.WHITE);
            addComponentListener(new ComponentAdapter() {
                public void componentResized(ComponentEvent e) { if (p[0] == null) resetToEquilateral(); }
            });
            MouseAdapter ma = new MouseAdapter() {
                public void mousePressed(MouseEvent e) {
                    for (int i = 0; i < 3; i++) if (p[i] != null && e.getPoint().distance(p[i]) < 25) dragIdx = i;
                }
                public void mouseReleased(MouseEvent e) { dragIdx = -1; }
                public void mouseDragged(MouseEvent e) {
                    if (dragIdx != -1) {
                        double newX = e.getPoint().getX(), newY = e.getPoint().getY();
                        if (e.isShiftDown()) newX = p[dragIdx].getX();
                        p[dragIdx].setLocation(newX, newY);
                        repaint();
                    }
                }
            };
            addMouseListener(ma); addMouseMotionListener(ma);
        }

        public void resetToEquilateral() {
            double cx = getWidth() / 2.0, cy = getHeight() / 2.0;
            if (cx <= 0) { cx = 600; cy = 400; }
            double s = Math.min(getWidth(), getHeight()) * 0.4;
            double h = (Math.sqrt(3) / 2) * s;
            p[0] = new Point2D.Double(cx - s / 2, cy + h / 3);
            p[1] = new Point2D.Double(cx + s / 2, cy + h / 3);
            p[2] = new Point2D.Double(cx, cy - 2 * h / 3);
            repaint();
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            if (p[0] == null) return;

            Point2D A = p[0], B = p[1], C = p[2];
            Point2D S = getS(A, B, C), U = getU(A, B, C), I = getI(A, B, C);
            Point2D H = new Point2D.Double(3 * S.getX() - 2 * U.getX(), 3 * S.getY() - 2 * U.getY());
            Point2D F = new Point2D.Double((H.getX() + U.getX()) / 2.0, (H.getY() + U.getY()) / 2.0);

            double rIn = getInR(A, B, C), rUm = A.distance(U), rFeuer = rUm / 2.0;

            // 1. Fermat & Napoleon Dreiecke (im Hintergrund)
            if (showFermat) {
                Point2D pAB = getEquilateralPoint(A, B, C);
                Point2D pBC = getEquilateralPoint(B, C, A);
                Point2D pCA = getEquilateralPoint(C, A, B);

                g2.setStroke(new BasicStroke(1.0f));
                drawNapoleonTri(g2, A, B, pAB, new Color(255, 100, 0, 30));
                drawNapoleonTri(g2, B, C, pBC, new Color(255, 100, 0, 30));
                drawNapoleonTri(g2, C, A, pCA, new Color(255, 100, 0, 30));

                // Simpson-Linien
                g2.setStroke(new BasicStroke(1.0f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new float[]{4f}, 0));
                g2.setColor(new Color(255, 140, 0, 180));
                g2.draw(new Line2D.Double(C, pAB));
                g2.draw(new Line2D.Double(A, pBC));
                g2.draw(new Line2D.Double(B, pCA));

                Point2D T = getIntersection(C, pAB, A, pBC);
                drawPt(g2, T, "T", new Color(255, 100, 0));
            }

            // 2. Hauptdreieck Hintergrund
            g2.setColor(new Color(245, 252, 255, 200));
            Path2D tri = new Path2D.Double();
            tri.moveTo(A.getX(), A.getY()); tri.lineTo(B.getX(), B.getY()); tri.lineTo(C.getX(), C.getY()); tri.closePath();
            g2.fill(tri);

            // 3. Hilfslinien
            BasicStroke dashed = new BasicStroke(1.2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 1.0f, new float[]{6f}, 0f);
            g2.setStroke(dashed);
            if (hS) { g2.setColor(Color.LIGHT_GRAY); g2.draw(new Line2D.Double(A, mid(B, C))); g2.draw(new Line2D.Double(B, mid(A, C))); g2.draw(new Line2D.Double(C, mid(A, B))); }
            if (hH) { g2.setColor(new Color(255, 100, 100)); g2.draw(new Line2D.Double(A, getFoot(A, B, C))); g2.draw(new Line2D.Double(B, getFoot(B, A, C))); g2.draw(new Line2D.Double(C, getFoot(C, A, B))); }
            if (hU) { g2.setColor(new Color(100, 180, 100)); g2.draw(new Line2D.Double(U, mid(A, B))); g2.draw(new Line2D.Double(U, mid(B, C))); g2.draw(new Line2D.Double(U, mid(A, C))); }
            if (hI) { g2.setColor(new Color(180, 100, 255)); g2.draw(new Line2D.Double(A, I)); g2.draw(new Line2D.Double(B, I)); g2.draw(new Line2D.Double(C, I)); }

            // 4. Kreise
            g2.setStroke(new BasicStroke(2.0f));
            if (showUmkreis) { g2.setColor(new Color(0, 120, 0, 80)); g2.draw(new Ellipse2D.Double(U.getX() - rUm, U.getY() - rUm, rUm * 2, rUm * 2)); }
            if (showInkreis) { g2.setColor(new Color(180, 0, 180, 80)); g2.draw(new Ellipse2D.Double(I.getX() - rIn, I.getY() - rIn, rIn * 2, rIn * 2)); drawPt(g2, I, "I", new Color(150, 0, 200)); }
            if (showFeuerbach) { g2.setColor(new Color(0, 100, 255, 80)); g2.draw(new Ellipse2D.Double(F.getX() - rFeuer, F.getY() - rFeuer, rFeuer * 2, rFeuer * 2)); drawPt(g2, F, "F", new Color(0, 100, 255)); }

            if (show9Points) {
                drawSmallPt(g2, mid(A, B), Color.GRAY); drawSmallPt(g2, mid(B, C), Color.GRAY); drawSmallPt(g2, mid(C, A), Color.GRAY);
                drawSmallPt(g2, getFoot(A, B, C), new Color(255, 50, 50)); drawSmallPt(g2, getFoot(B, A, C), new Color(255, 50, 50)); drawSmallPt(g2, getFoot(C, A, B), new Color(255, 50, 50));
                drawSmallPt(g2, mid(A, H), new Color(50, 50, 255)); drawSmallPt(g2, mid(B, H), new Color(50, 50, 255)); drawSmallPt(g2, mid(C, H), new Color(50, 50, 255));
            }

            if (showEuler) {
                g2.setColor(new Color(255, 140, 0));
                double dx = U.getX() - H.getX(), dy = U.getY() - H.getY();
                if (Math.abs(dx) + Math.abs(dy) > 0.1) {
                    g2.setStroke(new BasicStroke(2.0f));
                    g2.draw(new Line2D.Double(H.getX() - dx * 50, H.getY() - dy * 50, U.getX() + dx * 50, U.getY() + dy * 50));
                }
                drawPt(g2, S, "S", Color.BLACK); drawPt(g2, U, "U", new Color(0, 120, 0)); drawPt(g2, H, "H", Color.RED);
            }

            // Hauptdreieck Kanten
            g2.setColor(Color.BLUE); g2.setStroke(new BasicStroke(2.0f)); g2.draw(tri);
            for (Point2D pt : p) g2.fill(new Ellipse2D.Double(pt.getX() - 7, pt.getY() - 7, 14, 14));
            drawValueTable(g2, S, U, H, rUm, rFeuer);
        }

        private void drawNapoleonTri(Graphics2D g2, Point2D p1, Point2D p2, Point2D pTop, Color fill) {
            Path2D p = new Path2D.Double();
            p.moveTo(p1.getX(), p1.getY()); p.lineTo(p2.getX(), p2.getY()); p.lineTo(pTop.getX(), pTop.getY()); p.closePath();
            g2.setColor(fill); g2.fill(p);
            g2.setColor(new Color(fill.getRed(), fill.getGreen(), fill.getBlue(), 150)); g2.draw(p);
        }

        private Point2D getEquilateralPoint(Point2D p1, Point2D p2, Point2D ref) {
            double dx = p2.getX() - p1.getX(), dy = p2.getY() - p1.getY();
            double x = p1.getX() + 0.5 * dx - (Math.sqrt(3)/2.0) * dy;
            double y = p1.getY() + 0.5 * dy + (Math.sqrt(3)/2.0) * dx;
            Point2D r1 = new Point2D.Double(x, y);
            x = p1.getX() + 0.5 * dx + (Math.sqrt(3)/2.0) * dy;
            y = p1.getY() + 0.5 * dy - (Math.sqrt(3)/2.0) * dx;
            Point2D r2 = new Point2D.Double(x, y);
            return (r1.distance(ref) > r2.distance(ref)) ? r1 : r2;
        }

        private Point2D getIntersection(Point2D a1, Point2D a2, Point2D b1, Point2D b2) {
            double x1 = a1.getX(), y1 = a1.getY(), x2 = a2.getX(), y2 = a2.getY();
            double x3 = b1.getX(), y3 = b1.getY(), x4 = b2.getX(), y4 = b2.getY();
            double d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
            if (Math.abs(d) < 0.01) return a1;
            return new Point2D.Double(((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/d, ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/d);
        }

        private void drawValueTable(Graphics2D g2, Point2D S, Point2D U, Point2D H, double rU, double rF) {
            int x = getWidth() - 260, y = 30;
            g2.setColor(new Color(255, 255, 255, 220)); g2.fillRoundRect(x, y, 240, 160, 15, 15);
            g2.setColor(Color.DARK_GRAY); g2.drawRoundRect(x, y, 240, 160, 15, 15);
            g2.setFont(new Font("Monospaced", Font.BOLD, 13)); g2.drawString("GEOMETRIE-ANALYSE", x + 40, y + 25);
            g2.setFont(new Font("Monospaced", Font.PLAIN, 12));
            double dHS = H.distance(S), dSU = S.distance(U);
            g2.drawString(String.format("Abstand HS:  %7.1f px", dHS), x + 20, y + 55);
            g2.drawString(String.format("Abstand SU:  %7.1f px", dSU), x + 20, y + 75);
            g2.setColor(new Color(200, 0, 0)); g2.drawString(String.format("Verhältnis:  %7.2f (≈2)", dSU > 0.1 ? dHS / dSU : 0), x + 20, y + 95);
            g2.setColor(Color.DARK_GRAY); g2.drawLine(x + 20, y + 105, x + 220, y + 105);
            g2.drawString(String.format("Umkreis R:   %7.1f px", rU), x + 20, y + 125);
            g2.drawString(String.format("Feuerbach R: %7.1f px", rF), x + 20, y + 145);
        }

        private Point2D mid(Point2D p1, Point2D p2) { return new Point2D.Double((p1.getX() + p2.getX()) / 2, (p1.getY() + p2.getY()) / 2); }
        private Point2D getFoot(Point2D p, Point2D a, Point2D b) {
            double dx = b.getX() - a.getX(), dy = b.getY() - a.getY(), mSq = dx*dx + dy*dy;
            if (mSq < 0.01) return a;
            double u = ((p.getX() - a.getX()) * dx + (p.getY() - a.getY()) * dy) / mSq;
            return new Point2D.Double(a.getX() + u * dx, a.getY() + u * dy);
        }
        private Point2D getS(Point2D a, Point2D b, Point2D c) { return new Point2D.Double((a.getX() + b.getX() + c.getX()) / 3.0, (a.getY() + b.getY() + c.getY()) / 3.0); }
        private Point2D getU(Point2D a, Point2D b, Point2D c) {
            double x1 = a.getX(), y1 = a.getY(), x2 = b.getX(), y2 = b.getY(), x3 = c.getX(), y3 = c.getY();
            double d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
            if (Math.abs(d) < 0.01) return a;
            return new Point2D.Double(((x1*x1+y1*y1)*(y2-y3)+(x2*x2+y2*y2)*(y3-y1)+(x3*x3+y3*y3)*(y1-y2))/d, ((x1*x1+y1*y1)*(x3-x2)+(x2*x2+y2*y2)*(x1-x3)+(x3*x3+y3*y3)*(x2-x1))/d);
        }
        private Point2D getI(Point2D a, Point2D b, Point2D c) {
            double la = b.distance(c), lb = a.distance(c), lc = a.distance(b), s = la + lb + lc;
            return new Point2D.Double((la * a.getX() + lb * b.getX() + lc * c.getX()) / s, (la * a.getY() + lb * b.getY() + lc * c.getY()) / s);
        }
        private double getInR(Point2D a, Point2D b, Point2D c) {
            double la = b.distance(c), lb = a.distance(c), lc = a.distance(b), s = (la + lb + lc) / 2.0;
            return Math.sqrt(Math.max(0, (s - la) * (s - lb) * (s - lc) / s));
        }
        private void drawPt(Graphics2D g2, Point2D pt, String l, Color c) {
            g2.setColor(c); g2.fill(new Ellipse2D.Double(pt.getX() - 6, pt.getY() - 6, 12, 12));
            g2.setColor(Color.DARK_GRAY); g2.drawString(l, (int) pt.getX() + 12, (int) pt.getY() - 8);
        }
        private void drawSmallPt(Graphics2D g2, Point2D pt, Color c) {
            g2.setColor(c); g2.fill(new Ellipse2D.Double(pt.getX() - 4, pt.getY() - 4, 8, 8));
            g2.setColor(Color.WHITE); g2.draw(new Ellipse2D.Double(pt.getX() - 4, pt.getY() - 4, 8, 8));
        }
    }
}