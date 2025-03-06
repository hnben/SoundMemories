import UploadForm from "./UploadForm.jsx"
import UpdateRecordings from "./UpdateRecordings.jsx";

const ManageAudio = () => {
    return (
      <section>
        <h2>Manage Audio</h2>
        <p>Here you can upload, delete, or manage audio files.</p>
        <UploadForm/>
        <UpdateRecordings/>
      </section>
    );
  };
  
  export default ManageAudio;
  