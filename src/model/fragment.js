// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// ditch MemoryDB => s3 & dynamoDB
const {
  readFragmentData,
  writeFragmentData,
  deleteFragment,
  readFragment,
  writeFragment,
  listFragments,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (ownerId == null || type == null) {
      throw new Error('OwnerId and type are required.');
    }

    if (typeof size !== 'number') {
      throw new Error('Size must be a number.');
    }

    if (size < 0) {
      throw new Error('Size cannot be negative.');
    }

    const parsed = contentType.parse(type);
    if (!parsed) {
      throw new Error('Fragment constructor: cannot parse content type');
    }

    const now = new Date();

    this.id = id ? id : randomUUID();
    this.ownerId = ownerId;
    this.created = created ? created : now.toISOString();
    this.updated = updated ? updated : now.toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const value = await listFragments(ownerId, expand);
    return value;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const value = await readFragment(ownerId, id);
    if (value == undefined) {
      throw new Error("'readFragment' failed");
    }
    return value;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    return await deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * Fragments have two parts: 1) metadata (i.e., details about the fragment); and 2) data (i.e., the actual binary contents of the fragment).
   * @returns Promise<void>
   */
  async save() {
    const now = new Date();
    this.updated = now.toISOString();
    await writeFragment(this);
    return;
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    // const value = await readFragmentData(this.ownerId, this.id);
    // return value;
    // await is optional here? because async keyword automatically wrap return value in a promise? 
    return readFragmentData(this.ownerId, this.id); 
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data) {
      throw new Error("'setData' failed because of data is empty"); // 
    }
    const now = new Date();
    this.updated = now.toISOString();
    this.size = data.length;
    this.save();
    await writeFragmentData(this.ownerId, this.id, data);
    return;
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.type.startsWith('text')) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let arr = [];
    arr.push(this.mimeType);
    return arr;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  // TODO: POST /fragments can create any supported text, image or JSON fragments
  static isSupportedType(value) {
    var typeObj = contentType.parse(value).type;
    if (typeObj.startsWith('text/') || typeObj.startsWith('application/j') 
      || typeObj.startsWith('application/y') || typeObj.startsWith('image/')) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
