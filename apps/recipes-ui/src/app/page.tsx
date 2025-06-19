'use client'

export default function Page() {

    const handleOauth = async (event: any) => {
    event.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?ui=${encodeURIComponent(window.location.toString())}`;
  };


  return (
    <div className="">
        <button type='button' onClick={handleOauth}>google</button>
    </div>
  );
}
