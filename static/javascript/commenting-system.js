class CommentingSystem extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("submit", async function (event) {
      try {
        event.preventDefault();

        let parent = event.target.parentElement;
        let ul = parent.querySelector("ul");
        let form_data = new FormData(event.target);

        let comment = {
          author: form_data.get("author"),
          content: form_data.get("comment"),
          parent_id: event.target.getAttribute("data-parent-comment-id"),
          thread_id: Number(this.getAttribute("data-thread-id")),
        };

        let new_comment = this.create_comment(comment);
        ul.prepend(new_comment);

        if (event.target.matches("commenting-system section > form")) {
          // reset form fields
          event.target.reset();
        } else {
          // Re-enable comment reply button
          let button = event.target
            .closest("li")
            .querySelector("[data-reply-button]");

          button.removeAttribute("disabled");

          // Remove form
          event.target.remove();
        }

        let endpoint = "https://commentingsystem.com/api/comments";

        let request = new Request(endpoint, {
          method: "POST",
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comment),
        });

        await fetch(request);
      } catch (error) {
        console.log(error);
      }
    });

    this.addEventListener("click", async function (event) {
      if (event.target.matches("[data-reply-button]")) {
        // parent element: <article>
        let parent = event.target.parentElement;
        let parent_comment_id = parent.getAttribute("data-comment-id");

        // create a reply form
        let form = this.create_reply_form();
        form.setAttribute("data-parent-comment-id", parent_comment_id);
        let textarea = form.querySelector("textarea");

        // display reply form
        parent.after(form);

        // disable reply button
        event.target.setAttribute("disabled", "true");

        // set focus on form text area
        textarea.focus();
      }

      if (event.target.matches("[data-cancel-button]")) {
        // re-enable comment reply button
        let button = event.target
          .closest("li")
          .querySelector("[data-reply-button]");

        button.removeAttribute("disabled");

        // remove reply form
        let form = event.target.parentElement;

        form.remove();
      }
    });
  }

  create_reply_form() {
    let form = document.createElement("form");

    let input_label = document.createElement("label");
    input_label.setAttribute("for", "author");
    input_label.textContent = "Author";

    let input = document.createElement("input");
    input.setAttribute("name", "author");
    input.setAttribute("id", "author");
    input.setAttribute("value", "Internet stranger");

    let textarea_label = document.createElement("label");
    textarea_label.setAttribute("for", "comment");
    textarea_label.textContent = "Comment";

    let textarea = document.createElement("textarea");
    textarea.setAttribute("name", "comment");
    textarea.setAttribute("id", "comment");
    textarea.setAttribute("required", "true");

    let submit_button = document.createElement("button");
    submit_button.textContent = "Submit";

    let cancel_button = document.createElement("button");
    cancel_button.setAttribute("data-cancel-button", "");
    cancel_button.setAttribute("type", "button");
    cancel_button.textContent = "Cancel";

    form.append(
      input_label,
      input,
      textarea_label,
      textarea,
      submit_button,
      cancel_button,
    );

    return form;
  }

  create_comment(comment) {
    let li = document.createElement("li");
    let article = document.createElement("article");

    let div = document.createElement("div");

    let author = document.createElement("p");
    author.textContent = comment.author;

    let datetime = document.createElement("time");
    datetime.textContent = "Today";

    let content = document.createElement("p");
    content.textContent = comment.content;

    let button = document.createElement("button");
    button.setAttribute("data-reply-button", "");
    button.textContent = "Reply";

    let ul = document.createElement("ul");
    div.append(author, datetime);

    article.append(div, content, button);
    li.append(article, ul);

    return li;
  }
}

customElements.define("commenting-system", CommentingSystem);
