import IdeasApi from '../services/ideasApi';

class IdeaList {
  constructor() {
    this._ideaListEl = document.querySelector('#idea-list');
    this._ideas = [];
    this.getIdeas();
    this._validTags = new Set();
    this._validTags.add('technology');
    this._validTags.add('software');
    this._validTags.add('business');
    this._validTags.add('eduction');
    this._validTags.add('health');
    this._validTags.add('inventions');
  }

  addEventlistener() {
    this._ideaListEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-times')) {
        e.stopImmediatePropagation();
        const ideaId = e.target.parentElement.parentElement.dataset.id;
        this.deleteIdea(ideaId);
      }
    });
  }

  async getIdeas() {
    try {
      const res = await IdeasApi.getIdeas();
      this._ideas = res.data.data;
      this.render();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteIdea(ideaId) {
    try {
      // Delete from server
      const res = await IdeasApi.deleteIdea(ideaId);
      this._ideas.filter((idea) => idea._id !== ideaId);
      this.getIdeas();
    } catch (error) {
      alert('You can not delete this resource');
    }
  }

  addIdeaToList(idea) {
    this._ideas.push(idea);
    this.render();
  }

  getTagClass(tag) {
    tag = tag.toLowerCase();
    let tagCLass = '';
    if (this._validTags.has(tag)) {
      tagCLass = `tag-${tag}`;
    } else {
      tagCLass = '';
    }
    return tagCLass;
  }

  render() {
    this._ideaListEl.innerHTML = this._ideas
      .map((idea) => {
        const tagCLass = this.getTagClass(idea.tag);
        const deleteBtn =
          idea.username === localStorage.getItem('username')
            ? `<button class="delete"><i class="fas fa-times"></i></button>`
            : '';
        return `
            <div class="card" data-id="${idea._id}">
            ${deleteBtn}
            <h3>
              ${idea.text}
            </h3>
            <p class="tag ${tagCLass}">${idea.tag.toUpperCase()}</p>
            <p>
              Posted on <span class="date">${idea.date}</span> by
              <span class="author">${idea.username}</span>
            </p>
          </div>`;
      })
      .join('');
    this.addEventlistener();
  }
}

export default IdeaList;
