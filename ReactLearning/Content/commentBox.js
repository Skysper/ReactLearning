var CommentBox=React.createClass({
    loadCommentsFromServer:function()
    {
        $.ajax({
            url:urlConfig.list,
            type:"post",
            dataType:'json',
            cache:false,
            success:function(rel){
                console.log(rel);
                this.setState({data:rel.data});
            }.bind(this),
            error:function(xhr,status,err){
                console.error(this.props.url,status,err.toString());
            }.bind(this)
        });
    },
    getInitialState:function()
    {
        return {data:[]};
    },
    componentDidMount:function()
    {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer,this.props.pollInterval);
    },
    render:function(){
        return (
          <div className="commentBox">
             <h1>Comments</h1>
             <CommentList data={this.state.data} />
             <hr/>
             <CommentForm />
          </div>
      );
    }
});

var CommentList=React.createClass({
    render:function(){
        var commentNodes=this.props.data.map(function(comment){
            return (<Comment author={comment.Author} key={comment.Id}>
            {comment.Content}
          </Comment>);
});
return (
  <div className="commentList">
    {commentNodes}
  </div>);
}
});

var Comment=React.createClass({
    rawMarkup:function(){
        var rawMarkup=marked(this.props.children.toString(),{sanitize:false});
        return{__html:rawMarkup};
    },
    render:function(){
        return (
          <div className="comment">
            <h2 className="commentAuthor">
                {this.props.author}
            </h2>
            <span dangerouslySetInnerHTML={this.rawMarkup()}></span>
          </div>
      );
    }
});

var CommentForm=React.createClass({
    getInitialState:function()
    {
        return {author:'',text:''};
    },
    handleAuthorChange:function(e)
    {
        this.setState({author:e.target.value});
    },
    handleTextChange:function(e)
    {
        this.setState({text:e.target.value});
    },
    handleSubmit:function(e)
    {
        e.preventDefault();
        var author=this.state.author.trim();
        var text=this.state.text.trim();
        if(!text||!author) return;
        //
        $.post(urlConfig.save,{author:author,text:text},function(data){
            console.log(data);
        },"json");
    },
    render:function(){
        return (
          <form className="commentForm">
             <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} /><br />
             <input type="text" placeholder="Say something" value={this.state.text} onChange={this.handleTextChange}  />
             <input type="button" value="Post" onClick={this.handleSubmit} />
          </form>
       );
    }
});
ReactDOM.render(
   <CommentBox pollInterval={2000} />,document.getElementById("content"));
