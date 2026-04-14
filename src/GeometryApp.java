import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;
import java.text.DecimalFormat;

public class GeometryApp extends JFrame {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new GeometryApp().setVisible(true));
    }

    public GeometryApp() {
        setTitle("Berechne und Addiere – Dreiecksflächen");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        getContentPane().setBackground(new Color(18, 18, 28));

        DrawingPanel drawingPanel = new DrawingPanel();
        ControlPanel controlPanel = new ControlPanel(drawingPanel);

        add(drawingPanel, BorderLayout.CENTER);
        add(controlPanel, BorderLayout.EAST);

        setSize(1100, 750);
        setLocationRelativeTo(null);
    }

    // ─── Drawing Panel ───────────────────────────────────────────────────────────

    static class DrawingPanel extends JPanel {

        // Logical coordinates (0–100 space), will be scaled to panel size
        // Rectangle: A(top-left-ish), B(top-right), F(bottom-right), G(bottom-left)
        static final double[][] LOGICAL = {
                // index: A=0, B=1, C=2, D=3, E=4, F=5, G=6
                {38, 2},   // A
                {98, 2},   // B
                {48, 16},  // C
                {76, 56},  // D
                {58, 76},  // E
                {82, 96},  // F
                {2,  96},  // G
        };
        // Labels
        static final String[] LABELS = {"A","B","C","D","E","F","G"};

        // Triangles to highlight: ABC, ACG, GEF, FED, FDB
        // Each entry: {indices of 3 vertices, color}
        static final int[][] TRIS = {
                {0,1,2}, // ABC
                {0,2,6}, // ACG
                {6,4,5}, // GEF
                {5,4,3}, // FED
                {5,3,1}, // FDB
        };
        static final String[] TRI_NAMES = {"ABC","ACG","GEF","FED","FDB"};
        static final Color[] TRI_COLORS = {
                new Color(220, 60,  60,  180),  // ABC – red
                new Color(60,  130, 220, 180),  // ACG – blue
                new Color(180, 200, 60,  180),  // GEF – yellow-green
                new Color(220, 140, 40,  180),  // FED – orange
                new Color(120, 60,  200, 180),  // FDB – purple
        };

        // Draggable point state (logical coords)
        double[][] pts;
        int dragging = -1;
        int highlighted = -1; // which triangle is highlighted (-1=none, or index)
        boolean[] shown;      // which triangles are shown

        DrawingPanel() {
            pts = new double[LOGICAL.length][2];
            for (int i = 0; i < LOGICAL.length; i++) {
                pts[i][0] = LOGICAL[i][0];
                pts[i][1] = LOGICAL[i][1];
            }
            shown = new boolean[TRIS.length];

            setBackground(new Color(18, 18, 28));
            setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));

            MouseAdapter ma = new MouseAdapter() {
                @Override public void mousePressed(MouseEvent e) {
                    dragging = nearestPoint(e.getX(), e.getY());
                }
                @Override public void mouseReleased(MouseEvent e) {
                    dragging = -1;
                }
                @Override public void mouseDragged(MouseEvent e) {
                    if (dragging < 0) return;
                    double[] log = toLogical(e.getX(), e.getY());
                    pts[dragging][0] = Math.max(1, Math.min(99, log[0]));
                    pts[dragging][1] = Math.max(1, Math.min(99, log[1]));
                    repaint();
                }
                @Override public void mouseMoved(MouseEvent e) {
                    int near = nearestPoint(e.getX(), e.getY());
                    setCursor(near >= 0
                            ? Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)
                            : Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
                }
            };
            addMouseListener(ma);
            addMouseMotionListener(ma);
        }

        // ── coordinate helpers ──────────────────────────────────────────────────

        int margin() { return 40; }

        int[] toScreen(double lx, double ly) {
            int w = getWidth()  - 2*margin();
            int h = getHeight() - 2*margin();
            return new int[]{margin() + (int)(lx/100.0*w),
                    margin() + (int)(ly/100.0*h)};
        }

        double[] toLogical(int sx, int sy) {
            int w = getWidth()  - 2*margin();
            int h = getHeight() - 2*margin();
            return new double[]{(sx - margin()) * 100.0 / w,
                    (sy - margin()) * 100.0 / h};
        }

        int nearestPoint(int sx, int sy) {
            for (int i = 0; i < pts.length; i++) {
                int[] sc = toScreen(pts[i][0], pts[i][1]);
                int dx = sx - sc[0], dy = sy - sc[1];
                if (dx*dx + dy*dy < 200) return i;
            }
            return -1;
        }

        // ── area ───────────────────────────────────────────────────────────────

        /** Area in logical units */
        double area(int[] tri) {
            double[] p0 = pts[tri[0]], p1 = pts[tri[1]], p2 = pts[tri[2]];
            return 0.5 * Math.abs(
                    (p1[0]-p0[0])*(p2[1]-p0[1]) - (p2[0]-p0[0])*(p1[1]-p0[1])
            );
        }

        /** All areas, scaled so the bounding rectangle = 100 units */
        double[] areas() {
            double[] a = new double[TRIS.length];
            for (int i = 0; i < TRIS.length; i++) a[i] = area(TRIS[i]);
            return a;
        }

        // ── painting ───────────────────────────────────────────────────────────

        @Override protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // Background grid
            drawGrid(g2);

            // Filled triangles
            for (int i = 0; i < TRIS.length; i++) {
                if (!shown[i] && i != highlighted) continue;
                Color c = TRI_COLORS[i];
                if (i == highlighted) c = c.brighter();
                fillTriangle(g2, TRIS[i], c);
            }

            // Outline all triangles that are shown
            for (int i = 0; i < TRIS.length; i++) {
                if (!shown[i] && i != highlighted) continue;
                strokeTriangle(g2, TRIS[i], TRI_COLORS[i].brighter().brighter());
            }

            // Area labels inside shown triangles
            for (int i = 0; i < TRIS.length; i++) {
                if (!shown[i]) continue;
                drawAreaLabel(g2, i);
            }

            // Vertex dots and labels
            drawPoints(g2);
        }

        void drawGrid(Graphics2D g2) {
            g2.setColor(new Color(35, 35, 55));
            g2.setStroke(new BasicStroke(0.5f));
            int steps = 10;
            for (int i = 0; i <= steps; i++) {
                int[] a = toScreen(i*10, 0), b = toScreen(i*10, 100);
                g2.drawLine(a[0],a[1],b[0],b[1]);
                int[] c = toScreen(0, i*10), d = toScreen(100, i*10);
                g2.drawLine(c[0],c[1],d[0],d[1]);
            }
        }

        void fillTriangle(Graphics2D g2, int[] tri, Color c) {
            Polygon p = triPoly(tri);
            g2.setColor(c);
            g2.fill(p);
        }

        void strokeTriangle(Graphics2D g2, int[] tri, Color c) {
            Polygon p = triPoly(tri);
            g2.setColor(c);
            g2.setStroke(new BasicStroke(2f));
            g2.draw(p);
        }

        Polygon triPoly(int[] tri) {
            int[] xs = new int[3], ys = new int[3];
            for (int k = 0; k < 3; k++) {
                int[] sc = toScreen(pts[tri[k]][0], pts[tri[k]][1]);
                xs[k] = sc[0]; ys[k] = sc[1];
            }
            return new Polygon(xs, ys, 3);
        }

        void drawAreaLabel(Graphics2D g2, int i) {
            int[] tri = TRIS[i];
            double cx = (pts[tri[0]][0]+pts[tri[1]][0]+pts[tri[2]][0])/3;
            double cy = (pts[tri[0]][1]+pts[tri[1]][1]+pts[tri[2]][1])/3;
            int[] sc = toScreen(cx, cy);
            DecimalFormat df = new DecimalFormat("0.0");
            String txt = df.format(area(tri));
            g2.setFont(new Font("Monospaced", Font.BOLD, 13));
            FontMetrics fm = g2.getFontMetrics();
            int tw = fm.stringWidth(txt);
            g2.setColor(new Color(0,0,0,120));
            g2.fillRoundRect(sc[0]-tw/2-4, sc[1]-fm.getAscent(), tw+8, fm.getHeight(), 6, 6);
            g2.setColor(Color.WHITE);
            g2.drawString(txt, sc[0]-tw/2, sc[1]);
        }

        void drawPoints(Graphics2D g2) {
            for (int i = 0; i < pts.length; i++) {
                int[] sc = toScreen(pts[i][0], pts[i][1]);
                // Glow
                g2.setColor(new Color(255,220,0,60));
                g2.fillOval(sc[0]-10, sc[1]-10, 20, 20);
                g2.setColor(new Color(255,220,0));
                g2.fillOval(sc[0]-5, sc[1]-5, 10, 10);
                // Label
                g2.setFont(new Font("Georgia", Font.BOLD, 15));
                g2.setColor(Color.WHITE);
                g2.drawString(LABELS[i], sc[0]+8, sc[1]-6);
            }
        }
    }

    // ─── Control Panel ────────────────────────────────────────────────────────

    static class ControlPanel extends JPanel {

        DrawingPanel dp;
        JLabel[] areaLabels;
        JLabel totalLabel;
        JCheckBox[] checks;
        DecimalFormat df = new DecimalFormat("0.00");

        ControlPanel(DrawingPanel dp) {
            this.dp = dp;
            setBackground(new Color(24, 24, 38));
            setPreferredSize(new Dimension(270, 0));
            setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
            setBorder(new EmptyBorder(20, 16, 20, 16));

            add(title("BERECHNE UND ADDIERE"));
            add(Box.createVerticalStrut(18));

            areaLabels = new JLabel[DrawingPanel.TRIS.length];
            checks = new JCheckBox[DrawingPanel.TRIS.length];

            for (int i = 0; i < DrawingPanel.TRIS.length; i++) {
                final int idx = i;
                JPanel row = new JPanel(new BorderLayout(8,0));
                row.setBackground(new Color(30, 30, 48));
                row.setBorder(new CompoundBorder(
                        new MatteBorder(0,4,0,0, DrawingPanel.TRI_COLORS[i]),
                        new EmptyBorder(8,10,8,10)
                ));
                row.setMaximumSize(new Dimension(Integer.MAX_VALUE, 52));

                JCheckBox cb = new JCheckBox(DrawingPanel.TRI_NAMES[i]);
                cb.setFont(new Font("Monospaced", Font.BOLD, 14));
                cb.setForeground(Color.WHITE);
                cb.setBackground(new Color(30,30,48));
                cb.setSelected(false);
                cb.addActionListener(e -> {
                    dp.shown[idx] = cb.isSelected();
                    dp.repaint();
                    refreshAreas();
                });
                // hover highlight
                row.addMouseListener(new MouseAdapter() {
                    @Override public void mouseEntered(MouseEvent e) {
                        dp.highlighted = idx; dp.repaint();
                    }
                    @Override public void mouseExited(MouseEvent e) {
                        dp.highlighted = -1; dp.repaint();
                    }
                });

                JLabel aL = new JLabel("–");
                aL.setFont(new Font("Monospaced", Font.PLAIN, 13));
                aL.setForeground(new Color(180,180,200));

                row.add(cb, BorderLayout.WEST);
                row.add(aL, BorderLayout.EAST);

                areaLabels[i] = aL;
                checks[i] = cb;
                add(row);
                add(Box.createVerticalStrut(6));
            }

            add(Box.createVerticalStrut(12));
            JSeparator sep = new JSeparator();
            sep.setForeground(new Color(60,60,90));
            sep.setMaximumSize(new Dimension(Integer.MAX_VALUE, 2));
            add(sep);
            add(Box.createVerticalStrut(12));

            JPanel totalRow = new JPanel(new BorderLayout());
            totalRow.setBackground(new Color(24,24,38));
            JLabel tl = new JLabel("SUMME:");
            tl.setFont(new Font("Monospaced", Font.BOLD, 14));
            tl.setForeground(new Color(255,220,0));
            totalLabel = new JLabel("–");
            totalLabel.setFont(new Font("Monospaced", Font.BOLD, 15));
            totalLabel.setForeground(new Color(255,220,0));
            totalRow.add(tl, BorderLayout.WEST);
            totalRow.add(totalLabel, BorderLayout.EAST);
            add(totalRow);

            add(Box.createVerticalStrut(24));

            JButton showAll = styledButton("Alle zeigen", new Color(60,130,220));
            showAll.addActionListener(e -> {
                for (int i=0;i<checks.length;i++) { checks[i].setSelected(true); dp.shown[i]=true; }
                dp.repaint(); refreshAreas();
            });
            JButton hideAll = styledButton("Alle verbergen", new Color(100,50,50));
            hideAll.addActionListener(e -> {
                for (int i=0;i<checks.length;i++) { checks[i].setSelected(false); dp.shown[i]=false; }
                dp.repaint(); refreshAreas();
            });
            JButton reset = styledButton("Punkte zurücksetzen", new Color(50,80,60));
            reset.addActionListener(e -> {
                for (int i=0;i<dp.pts.length;i++) {
                    dp.pts[i][0] = DrawingPanel.LOGICAL[i][0];
                    dp.pts[i][1] = DrawingPanel.LOGICAL[i][1];
                }
                dp.repaint(); refreshAreas();
            });
            add(showAll); add(Box.createVerticalStrut(6));
            add(hideAll); add(Box.createVerticalStrut(6));
            add(reset);

            add(Box.createVerticalStrut(20));
            add(hint("💡 Punkte ziehen zum Verschieben"));

            // Timer to refresh area labels
            Timer t = new Timer(60, e -> refreshAreas());
            t.start();
        }

        void refreshAreas() {
            double[] areas = dp.areas();
            double sum = 0;
            for (int i = 0; i < areas.length; i++) {
                areaLabels[i].setText(df.format(areas[i]));
                if (dp.shown[i]) sum += areas[i];
            }
            boolean any = false;
            for (boolean s : dp.shown) if (s) { any=true; break; }
            totalLabel.setText(any ? df.format(sum) : "–");
        }

        JLabel title(String text) {
            JLabel l = new JLabel("<html><div style='text-align:center'>" + text + "</div></html>");
            l.setFont(new Font("Georgia", Font.BOLD, 15));
            l.setForeground(new Color(255,220,0));
            l.setAlignmentX(CENTER_ALIGNMENT);
            return l;
        }

        JLabel hint(String text) {
            JLabel l = new JLabel("<html><i>" + text + "</i></html>");
            l.setFont(new Font("SansSerif", Font.ITALIC, 11));
            l.setForeground(new Color(120,120,160));
            l.setAlignmentX(CENTER_ALIGNMENT);
            return l;
        }

        JButton styledButton(String text, Color bg) {
            JButton b = new JButton(text);
            b.setBackground(bg);
            b.setForeground(Color.WHITE);
            b.setFont(new Font("Monospaced", Font.BOLD, 12));
            b.setBorderPainted(false);
            b.setFocusPainted(false);
            b.setMaximumSize(new Dimension(Integer.MAX_VALUE, 36));
            b.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            return b;
        }
    }
}