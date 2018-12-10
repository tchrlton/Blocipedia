module.exports = class WikiPolicy {

  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isStandard() {
    return this.user && this.user.role == "standard";
  }

  _isAdmin() {
    return this.user && this.user.role == "admin";
  }

  _isPremium() {
    return this.user && this.user.role == "premium";
  }

  _isPrivate() {
    return this.record.private == true;
  }

  _isPublic() {
    return this.record.private == false;
  }

  new() {
    return this._isStandard() || this._isPremium() || this._isAdmin();
  }

  create() {
    return this._isPublic() || this._isPremium() || this._isAdmin() || this._isStandard();
  }

  show() {
    return this._isOwner() || this._isPublic(); 
  }

  edit() {
    return this._isPublic() || this._isOwner() || this._isAdmin();
  }

  update() {
    return this.edit(); 
  }

  destroy() {
    return this._isAdmin() || this._isOwner();
  }

  makePrivate() {
    return this._isAdmin() || this._isOwner();
  }
}