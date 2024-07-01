const { logger } = require("firebase-functions");
const pool = require("../db");

class Note {
  static async getNotes() {
    try {
      const result = await pool.query(`SELECT * FROM notes order by datetime`);
      return result.rows;
    } catch (err) {
      logger.error("getNotes() error ", err);
      return { message: err.message };
    }
  } //getNotes

  static async createNote(req, res) {
    try {
      const { note } = req.body;
      if (!note || !note?.text || !note?.user)
        return res
          .status(400)
          .json({ message: "Bad request: Note information is required" });

      //call procedure
      await pool.query(
        `CALL create_note(note_text => $1::TEXT, username => $2::TEXT)`,
        [note.text, note.user]
      );

      //send reponse
      return res.sendStatus(201);
    } catch (err) {
      logger.error("createNote() error: ", err);
      return res.status(500).json({ message: err.message });
    }
  } //createNote

  static async deleteNote(req, res) {
    try {
      const { note } = req.body;
      if (!note || !note?.id || !note?.user)
        return res
          .status(400)
          .json({ message: "Bad request: Note information is required" });

      //call procedure
      await pool.query(
        `CALL delete_note(noteid => ${note.id}, changeuser => '${note.user}'::TEXT)`
      );

      //send reponse
      return res.sendStatus(200);
    } catch (err) {
      logger.error("deleteNote() error: ", err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteNote
}

module.exports = { Note };
