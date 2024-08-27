const api = {
  hostname: "https://api.github.com",
  async getIssues() {
    const response = await fetch(`${this.hostname}/products`);
    const data = await response.json();
    return data;
  },

  async getRepo(username) {
    const response = await fetch(`${this.hostname}/users/${username}/repos`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },

  async getAllIssue(username, repo) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/issues`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },

  async getLabelsWithFilter(username, repo, filter) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/labels`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch labels");
    }

    const labels = await response.json();
    // 根據 filter 進行篩選
    return labels.filter((label) => label.name.includes(filter));
  },

  async getAllLabelFromIssue(username, repo) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/labels`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },

  async getSearchIssues(username, repo) {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q");

    if (q) {
      const response = await fetch(
        `${
          this.hostname
        }/search/issues?q=repo:${username}/${repo} ${encodeURIComponent(q)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search issues");
      }

      const data = await response.json();
      console.log(data);
      return data.items;
    }
  },
};

export default api;
