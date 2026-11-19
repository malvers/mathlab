package de.docalvers.docfit;

import android.content.SharedPreferences;

/**
 * What the body-composition formulas need besides the scale: height, birth year and sex. Doc types them into the
 * profile dialog; they live only in the app's preferences on the phone. There are deliberately no defaults - until
 * Doc enters them the app shows the weight alone (the repository is public, no personal value belongs in the code).
 */
final class Profile {
    static final int MIN_HEIGHT = 100, MAX_HEIGHT = 250, MIN_YEAR = 1900;
    static final char MALE = 'm', FEMALE = 'w', UNSET = 0;

    final int heightCm;    // 0 = not entered
    final int birthYear;   // 0 = not entered
    final char sex;        // MALE, FEMALE or UNSET

    Profile(int heightCm, int birthYear, char sex) {
        this.heightCm = heightCm;
        this.birthYear = birthYear;
        this.sex = sex;
    }

    boolean hasHeight() {
        return heightCm >= MIN_HEIGHT && heightCm <= MAX_HEIGHT;
    }

    boolean complete() {
        return hasHeight() && birthYear >= MIN_YEAR && (sex == MALE || sex == FEMALE);
    }

    /** Age in whole years in the given calendar year (the birthday itself is not stored, the year is close enough). */
    int ageIn(int year) {
        return birthYear >= MIN_YEAR ? year - birthYear : 0;
    }

    static Profile load(SharedPreferences p) {
        String sex = p.getString("profileSex", "");
        return new Profile(p.getInt("profileHeight", 0), p.getInt("profileBirthYear", 0),
                sex.isEmpty() ? UNSET : sex.charAt(0));
    }

    void save(SharedPreferences p) {
        p.edit().putInt("profileHeight", heightCm).putInt("profileBirthYear", birthYear)
                .putString("profileSex", sex == UNSET ? "" : String.valueOf(sex)).apply();
    }
}
