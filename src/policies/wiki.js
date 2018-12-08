module.exports = class WikiPolicy {
    constructor(user, record) {
      this.user = user;
      this.record = record;
    }

    _isStandard() {
        return this.record && (this.record.userId === 0);
    }

    _isOwner() {
        return this.record && (this.record.userId == this.user.id);
    }
    
    _isPremium() {
        return this.user && (this.user.role === 1);
    }
  
    _isAdmin() {
        return this.user && (this.user.role === 2);
    }

    _isPublic() {
        return this.record.private == false;
    }
  
    new() {
      return this.user != null;
    }
  
    create() {
      return this.new();
    }
  
    show() {
      return true;
    }
  
    edit() {
      return this.new();
    }
  
    update() {
      return this.edit();
    }
  
    destroy() {
      return this.update();
    }
  }