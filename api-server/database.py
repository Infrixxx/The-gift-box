from pathlib import Path
import sqlite3

DB_PATH = Path(__file__).resolve().parent / "giftbox.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        pin TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT DEFAULT 'Treat',
        icon TEXT DEFAULT '🎟️',
        redeemed_at TEXT,
        is_redeemed BOOLEAN DEFAULT 0,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS scavenger_clues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        step_number INTEGER NOT NULL,
        chapter_title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        riddle_prompt TEXT NOT NULL,
        hint TEXT NOT NULL,
        accepted_answers TEXT NOT NULL,
        memory_title TEXT NOT NULL,
        memory_story TEXT NOT NULL,
        is_unlocked BOOLEAN DEFAULT 0,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    ''')

    cursor.execute('''
    INSERT INTO users (username, pin) VALUES ('partner', '06062024')
    ON CONFLICT(username) DO UPDATE SET pin = '06062024'
    ''')

    # Check if coupons already exist so we don't duplicate them
    cursor.execute("SELECT COUNT(*) FROM coupons")
    if cursor.fetchone()[0] == 0:
        initial_coupons = [
            (
                "One Argument Automatically Won",
                "Play this card at any point during a debate and I immediately concede. Zero pushback, full agreement.",
                "VIP Power",
                "👑"
            ),
            (
                "20-Minute Foot & Back Massage",
                "Redeemable after a long, exhausting day. Includes your choice of music and zero rushing.",
                "Relaxation",
                "💆‍♀️"
            ),
            (
                "Get Out of One Chore Free",
                "Pass any task or responsibility straight to me dishes, errands, or cleanup handled immediately.",
                "Daily Pass",
                "✨"
            ),
            (
                "Call of Duty Squad Captain",
                "You pick the game modes, the drops, and the strategy for an entire gaming session and I bring the snacks.",
                "Gaming",
                "🎮"
            ),
            (
                "Chef's Table: Dinner Choice",
                "Whether you want me to cook your favorite meal from scratch or order from your favorite spot, it's on me.",
                "Foodie",
                "🍽️"
            ),
            (
                "Undisputed Movie & Series Veto",
                "Total control of the screen for a night. Even if I've been dying to watch something else, your pick rules.",
                "Date Night",
                "🍿"
            ),
            (
                "Spontaneous Late-Night Craving Run",
                "Craving something sweet or salty at 11 PM? Redeem this and I will go get it, no questions asked.",
                "Treat",
                "🍫"
            ),
            (
                "A Full Day Planned Around You",
                "From morning coffee to a surprise evening activity hand over the reins and let me spoil you all day.",
                "Romance",
                "🌹"
            ),
        ]
        cursor.executemany(
            "INSERT INTO coupons (title, description, category, icon, is_redeemed, user_id) VALUES (?, ?, ?, ?, 0, 1)",
            initial_coupons
        )

    # Re-seed scavenger hunt clues with the 6 complete chapters
    initial_clues = [
        (
            1,
            "Chapter I: Where the Rhythm Began",
            "May • Movie Night • 06.06.2024",
            "We first crossed paths around a movie night in May, and not long after, your friend invited you over to chill. We connected effortlessly, like two souls picking up a conversation they started lifetimes ago. Before we ever made things official on the 6th of the 6th month in 2024, there was one specific thing in that room you became completely obsessed with and insisted you wanted to play. What was it?",
            "It has keys, and you couldn't take your hands or eyes off it.",
            "keyboard|the keyboard|piano|my keyboard|a keyboard",
            "Memory Unlocked: The 6th of June, 2024",
            "From that first interaction around movie night to watching you light up over the keyboard, we fell into one another before we even knew what was happening. Making you mine on 06/06/2024 was the easiest, most natural decision of my life.",
            0
        ),
        (
            2,
            "Chapter II: The Look & The Accusation",
            "PC & Mobile Battles • Inside Jokes",
            "From playing games on the PC to dominating lobbies on mobile, I learned early on just how fiercely competitive you are. Yet right alongside that fire is the playful warmth that makes me stare at you in awe. Whenever I look at you in that funny, admiring way, what is the exact phrase you always love to say to me? Complete the line: 'O etsang, o batla go _______'",
            "Starts with 'n', accusing me of trying to charm you with just a look.",
            "nseduca|o batla go nseduca|o etsang o batla go nseduca|seduca|seduce",
            "Memory Unlocked: Guilty Every Single Time",
            "Every time you catch me staring and hit me with 'O etsang, o batla go nseduca,' I can't help but laugh, because the truth is, you had already won me over from day one.",
            0
        ),
        (
            3,
            "Chapter III: The Way to Your Heart",
            "Signature Cravings • Sweet & Savory",
            "To say you love shawarma would be the understatement of the century, as you are borderline obsessed with it from one very specific spot. Pair that with your ultimate favorite Cadbury TopDeck chocolate slab, and you are in heaven. Name either the restaurant that makes your favorite shawarma OR the specific flavor of your favorite TopDeck slab to unlock the next chapter.",
            "Think flame-grilled fiesta (starts with M) or that cool refreshing green layer inside your favorite chocolate bar.",
            "mochachos|mochacho's|mint|topdeck mint|cadbury topdeck mint|cadbury mint|peppermint",
            "Memory Unlocked: Your Signature Favorites",
            "Knowing the exact little things that bring a smile to your face, whether it's a fresh shawarma from Mochachos or surprising you with a Cadbury TopDeck Mint, is one of my favorite parts of loving you.",
            0
        ),
        (
            4,
            "Chapter IV: My Sanctuary in the Storm",
            "Peppermint • Park Mews • Resilience",
            "There came a season where my entire world collapsed. I lost my money from trading, lost my space in Aeronautical Engineering at Wits, and felt like my dreams were over. Life stood still right down to the final day on the lease of our first apartment at Peppermint. Through nights when I had to sleep in a bathroom or the library, you never turned your back on me. You opened the door to your res, cooked warm meals for me, and made sure I always had a hot shower and a safe bed to rest my head. What was the name of your res that became my sanctuary in the storm?",
            "Starts with 'Park' — your building that protected me when everything else had fallen apart.",
            "park mews|parkmews|park mews res|park mews residence|peppermint",
            "Memory Unlocked: The Woman Who Held Me Up",
            "When I had nothing to offer but broken pieces, you gave me shelter, hot food, a shower, and dignity in your res room at Park Mews, even when things were heavy and difficult for you too. From the days our lease ended at Peppermint to standing near the completion of my WeThinkCode_ journey today, it is because you refused to let me fall when my foundation was shaken. I will never forget what you did for me.",
            0
        ),
        (
            5,
            "Chapter V: Our First Valentine's Escape",
            "Coastal Waves • Golden Hour • February 14",
            "Beyond the late-night battles and the quiet sanctuaries, there are moments where the world simply faded into the background. For our very first Valentine's Day together, we escaped the routine and took a special trip to celebrate our love right by the ocean, with the breeze, the waves, and unforgettable memories. What coastal city did we travel to for our first Valentine's getaway?",
            "A famous South African coastal city known for its warm ocean waters, Golden Mile, and subtropical warmth (starts with 'D').",
            "durban|dbn|durban trip|to durban|durbs",
            "Memory Unlocked: First Valentine's in Durban",
            "Escaping together to Durban for our first Valentine's Day proved that no matter where we go in this world, having you beside me makes everywhere feel like paradise. Listening to the ocean with you and celebrating our love by the coast is a memory forever etched into my heart.",
            0
        ),
        (
            6,
            "Chapter VI: Unlearning the Walls",
            "The Final Key • BC Rachoshi",
            "Before I found you, I had completely given up on love. Unlearning the defensive habits I built to protect myself and tearing down the high walls around my heart wasn't easy. Yet every time I heard your voice, saw your smile, and felt your warmth, my soul flowed with ease. It inspired a poem born from our very first encounter. Complete the question in its title to unlock your final birthday gift: 'If my heart could _____, would you listen?'",
            "A four-letter word for making music with your voice.",
            "sing|if my heart could sing|listen",
            "Finale Unlocked: If My Heart Could Sing, Would You Listen?",
            "From a simple hello that was meant for my ears, yet greeted my soul and awakened my heart, you moved into my mind without notice and turned cold waters into liquid gold. Here is my heart singing for you.",
            0
        ),
    ]

    # Preserve any previous unlock states if applicable, otherwise reset
    cursor.execute("SELECT step_number, is_unlocked FROM scavenger_clues WHERE user_id = 1")
    unlocked_map = {row[0]: row[1] for row in cursor.fetchall()}

    cursor.execute("DELETE FROM scavenger_clues WHERE user_id = 1")
    clues_to_insert = [
        (c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], unlocked_map.get(c[0], 0), 1)
        for c in initial_clues
    ]
    cursor.executemany(
        """INSERT INTO scavenger_clues 
        (step_number, chapter_title, subtitle, riddle_prompt, hint, accepted_answers, memory_title, memory_story, is_unlocked, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        clues_to_insert
    )

    conn.commit()
    conn.close()
    print("SQLite database, coupons, and 6-chapter Scavenger Hunt initialized successfully.")

if __name__ == "__main__":
    init_db()